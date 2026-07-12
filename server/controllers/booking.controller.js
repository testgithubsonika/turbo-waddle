const redis = require('../config/redis_TCP');
const db = require('../models');
const { Op } = require('sequelize');
const generatePNR = require('../utils/pnrGenerator');
const emailService = require('../redis_tcp/emailService');
const { cancelBookingAndPromoteWaitlist } = require('../services/bookingCancellation.service');
const { buildRtcPredictionPayload, sendRtcPrediction } = require('../services/rtcPredictionService');
// Import the template at the top of your file
const { getBookingConfirmationEmail } = require('../utils/emailTemplates');
const User = db.User;
const Booking = db.Booking;
const Ticket = db.Ticket;
const Seat = db.Seat;
const Train = db.Train;
const Cancellation = db.Cancellation;
const SeatAvailability = db.SeatAvailability;

exports.getBookingHistory = async (req, res) => {
  const user_id = req.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { status, start_date, end_date } = req.query;
  const cacheKey = `booking_history:${user_id}:page=${page}:limit=${limit}:status=${status || 'all'}`;
 
  try {
    // --- Check Cache First ---
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log('📦 Cache hit - returning data from Redis');
      let parsed;
      try {
        parsed = (typeof cachedData === 'string') ? JSON.parse(cachedData) : cachedData;
      } catch (err) {
        console.warn('⚠️ Cached payload is not valid JSON, returning raw cached value:', err.message);
        parsed = cachedData; // return raw value instead of throwing
      }
      return res.status(200).send(parsed);
    }

    // ---Query Params ---
    const offset = (page - 1) * limit;

    // --- Build Dynamic WHERE Clause ---
    const whereClause = { user_id };
    if (status) whereClause.status = status.toLowerCase();
    if (start_date && end_date) {
      whereClause.journey_date = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    } else if (start_date) {
      whereClause.journey_date = { [Op.gte]: new Date(start_date) };
    } else if (end_date) {
      whereClause.journey_date = { [Op.lte]: new Date(end_date) };
    }

    // --- Fetch Data with Count for Pagination ---
    const { rows: bookings, count } = await Booking.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [['journey_date', 'DESC']],
      attributes: ['id', 'pnr', 'journey_date', 'total_fare', 'status', 'createdAt'],
      include: [
        {
          model: Ticket,
          attributes: ['id', 'passenger_name', 'passenger_age', 'passenger_gender'],
          include: [{
            model: Seat,
            attributes: ['seat_number', 'coach', 'class_type', 'train_id'],
            include: [{
              model: Train,
              attributes: ['train_name', 'train_number']
            }]
          }]
        },
        {
          model: Cancellation,
          attributes: ['cancellation_date', 'refund_amount']
        }
      ],
    });

    const formattedHistory = bookings.map(booking => ({
      booking_id: booking.id,
      pnr: booking.pnr,
      journey_date: booking.journey_date,
      total_fare: booking.total_fare,
      status: booking.status,
      cancellation: booking.Cancellation ? {
        cancellation_date: booking.Cancellation.cancellation_date,
        refund_amount: booking.Cancellation.refund_amount
      } : null,
      tickets: (booking.Tickets || []).map(ticket => ({
        ticket_id: ticket.id,
        passenger_name: ticket.passenger_name,
        passenger_age: ticket.passenger_age,
        passenger_gender: ticket.passenger_gender,
        seat_number: ticket.Seat?.seat_number,
        coach: ticket.Seat?.coach,
        class_type: ticket.Seat?.class_type,
        train_name: ticket.Seat?.Train?.train_name,
        train_number: ticket.Seat?.Train?.train_number,
      })),
    }));

    const response = {
      user_id,
      filters_applied: {
        status: status || 'all',
        start_date: start_date || null,
        end_date: end_date || null,
      },
      pagination: {
        total_records: count,
        current_page: page,
        total_pages: Math.ceil(count / limit),
        records_per_page: limit,
      },
      bookings: formattedHistory,
    };

    // --- Store in Cache (TTL = 60 seconds) ---
    try {
      await redis.set(cacheKey, JSON.stringify(response), 'EX', 60);
    } catch (err) {
      console.warn('⚠️ Failed to set cache:', err.message);
    }
    
    return res.status(200).send(response);

  } catch (error) {
    console.error('Error fetching booking history:', error);
    return res.status(500).send({ 
      message: `Failed to retrieve booking history: ${error.message}` 
    });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const user_id = req.userId;
    const journeyDate = req.body.journey_date || req.body.date;
    const classType = req.body.class_type || req.body.classType;
    const trainId = req.body.train_id || req.body.trainId;
    const routeId = req.body.route_id || req.body.routeId;
    const distanceKm = req.body.distance_km || req.body.distanceKm;
    const fromSequence = req.body.from_sequence || req.body.fromSequence;
    const toSequence = req.body.to_sequence || req.body.toSequence;
    const passengers = req.body.passengers || [];

    if (!user_id || !trainId || !journeyDate || !classType || !distanceKm || !routeId || !fromSequence || !toSequence || passengers.length === 0) {
      return res.status(400).json({ message: 'Missing required fields: journey_date, class_type, train_id, route_id, distance_km, from_sequence, to_sequence, passengers' });
    }

    // Fetch train to get base_fare_per_km
    const train = await Train.findByPk(trainId);
    if (!train) {
      return res.status(404).json({ message: 'Train not found.' });
    }

    console.log({ trainId, classType, routeId, passengersCount: passengers.length, segment: `${fromSequence}->${toSequence}` });

    const quota = req.body.quota || 'GN';
    const seatLockKey = `seat_lock_${trainId}_${routeId}_${journeyDate}`;

    const t = await db.sequelize.transaction({ 
      isolationLevel: db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE 
    });

    try {
      // --- Check Journey Date Validity ---
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const journeyDateObj = new Date(journeyDate);
      journeyDateObj.setHours(0, 0, 0, 0);

      if (journeyDateObj < today) {
        await t.rollback();
        return res.status(400).send({ message: 'Cannot book a past journey date.' });
      }

      // --- Get or Initialize Seat Availability ---
      let availability = await SeatAvailability.findOne({
        where: {
          train_id: trainId,
          journey_date: journeyDateObj,
          class_type: classType,
          quota,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!availability) {
        const seatCount = await Seat.count({
          where: {
            train_id: trainId,
            class_type: classType,
          },
          transaction: t,
        });

        const baseFare = Math.max(1, Number(train.base_fare_per_km) * Number(distanceKm || 0));
        const bookingOpenFrom = new Date();
        const bookingOpenTo = new Date(journeyDateObj);
        bookingOpenTo.setHours(23, 59, 59, 999);

        availability = await SeatAvailability.create({
          train_id: trainId,
          journey_date: journeyDateObj,
          class_type: classType,
          quota,
          total_seats: seatCount || 0,
          available_seats: seatCount || 0,
          rac_limit: 0,
          rac_used: 0,
          wl_limit: 0,
          wl_used: 0,
          base_fare: baseFare,
          quota_extra_fare: 0,
          booking_open_from: bookingOpenFrom,
          booking_open_to: bookingOpenTo,
        }, { transaction: t });
      }

      const now = new Date();
      if (now < availability.booking_open_from || now > availability.booking_open_to) {
        await t.rollback();
        throw new Error('Booking not open for this quota');
      }

      // --- Determine Booking Status ---
      let bookingStatus;
      let wl_number = null;
      let rac_number = null;

      if (availability.available_seats >= passengers.length) {
        bookingStatus = 'CNF';
        availability.available_seats -= passengers.length;
      }
      else if (availability.rac_used < availability.rac_limit) {
        bookingStatus = 'RAC';
        availability.rac_used += 1;
        rac_number = availability.rac_used;
      }
      else if (availability.wl_used < availability.wl_limit) {
        bookingStatus = 'WL';
        availability.wl_used += 1;
        wl_number = availability.wl_used;
      }
      else {
        await t.rollback();
        throw new Error('No seats available');
      }

      await availability.save({ transaction: t });

      const rtcPayload = buildRtcPredictionPayload({
        train,
        classType,
        quota,
        availability,
      });

      const rtcPrediction = await sendRtcPrediction(rtcPayload);
      if (rtcPrediction) {
        console.log('🤖 RTC prediction', rtcPrediction);
      }

      // --- Create Booking ---
      const totalFare =
        (Number(availability.base_fare) + Number(availability.quota_extra_fare))
        * passengers.length;

      const newBooking = await Booking.create({
    user_id,
    train_id: trainId,
    class_type: classType,
    pnr: generatePNR(),
    journey_date: journeyDate,
    quota,
    status: bookingStatus,
    wl_number,
    rac_number,
    total_fare: totalFare,
}, { transaction: t });

      // --- Assign Seats Only for CNF ---
      if (bookingStatus === 'CNF') {
        // Fetch Free Seats Using Overlap Logic
        const freeSeatIds = await db.sequelize.query(
          `
          SELECT s.id
          FROM seats s
          WHERE s.train_id = :trainId
            AND s.class_type = :classType
            AND s.id NOT IN (
              SELECT DISTINCT sa.seat_id
              FROM seat_allocations sa
              WHERE sa.journey_date = :journeyDate
                AND sa.route_id = :routeId
                AND sa.from_sequence < :toSeq
                AND sa.to_sequence > :fromSeq
            )
          LIMIT :limit
          FOR UPDATE
          `,
          {
            replacements: { 
              trainId, 
              classType, 
              journeyDate: journeyDateObj,
              routeId,
              fromSeq: fromSequence,
              toSeq: toSequence,
              limit: passengers.length
            },
            type: db.sequelize.QueryTypes.SELECT,
            transaction: t,
          }
        );

        if (freeSeatIds.length < passengers.length) {
          await t.rollback();
          return res.status(400).json({ message: 'Not enough available seats for the requested passengers.' });
        }

        const seatIds = freeSeatIds.map(s => s.id);
        
        const ticketAndAllocationPromises = passengers.map((p, i) => {
          const seatId = seatIds[i];
          // Create ticket
          return Ticket.create({
            booking_id: newBooking.id,
            seat_id: seatId,
            passenger_name: p.name,
            passenger_age: p.age,
            passenger_gender: p.gender,
          }, { transaction: t }).then(() => {
            // Create seat allocation
            return db.SeatAllocation.create({
              seat_id: seatId,
              booking_id: newBooking.id,
              journey_date: journeyDateObj,
              route_id: routeId,
              from_sequence: fromSequence,
              to_sequence: toSequence,
            }, { transaction: t });
          });
        });

        await Promise.all(ticketAndAllocationPromises);
      } else {
        // For RAC/WL, create tickets without seats
        const tickets = passengers.map((p) => ({
          booking_id: newBooking.id,
          seat_id: null,
          passenger_name: p.name,
          passenger_age: p.age,
          passenger_gender: p.gender,
        }));

        await Ticket.bulkCreate(tickets, { transaction: t });
      }

      // --- Simulate Payment Gateway Integration ---
      const dummyPaymentSuccess = true; // Replace with real payment API result
      if (!dummyPaymentSuccess) {
        await t.rollback();
        return res.status(402).send({ message: 'Payment failed. Booking rolled back.' });
      }

      await t.commit();
      // Clear the Redis lock after successful booking
      try {
        await redis.del(seatLockKey);
      } catch (_) {}

      // --- Fetch Full `seat_lock_${trainId}_${routeId}_${journeyDate}`h Relations ---
      // const bookingDetails = await Booking.findByPk(newBooking.id, {
const bookingDetails = await Booking.findByPk(newBooking.id, {
  include: [{
    model: Ticket,
    include: [{
      model: Seat,
      attributes: ['seat_number', 'coach', 'class_type'],
    }],
  }],
});

try {
  const user = await User.findByPk(user_id);
  if (user?.email) {
    await emailService.sendEmail({
      to: user.email,
      subject: 'Booking Confirmation - ' + bookingDetails.pnr,
      // Pass the booking object into your new template function
      html: getBookingConfirmationEmail(bookingDetails)
    });
  }
} catch (error) {
  console.error("Email failed:", error);
}

      return res.status(201).send({
        message: 'Booking confirmed successfully.',
        booking: bookingDetails,
      });

    } catch (error) {
      if (!t.finished) await t.rollback();
      // Clear the Redis lock on error
      try {
        await redis.del(seatLockKey);
      } catch (_) {}
      
      console.error('Booking error:', error);
      res.status(500).send({ message: `Booking failed: ${error.message}` });
    }
  } catch (err) {
    console.error('Booking error:', err);
    return res.status(500).json({ message: 'Booking failed', error: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const user_id = req.userId;

    // Verify booking belongs to user
    const booking = await Booking.findOne({
      where: { id: booking_id, user_id }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled.' });
    }

    // --- Date Validation ---
    const journeyDate = new Date(booking.journey_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    journeyDate.setHours(0, 0, 0, 0);

    if (journeyDate < today) {
      return res.status(400).json({ message: 'Cannot cancel a past journey.' });
    }

    // --- Refund Calculation (time-sensitive refund policy) ---
    const hoursBeforeJourney = (new Date(booking.journey_date) - new Date()) / (1000 * 60 * 60);
    let refundRate = 0.8; // default 80% refund

    if (hoursBeforeJourney < 24) refundRate = 0.5;   // 50% if within 24 hours
    if (hoursBeforeJourney < 6) refundRate = 0.25;   // 25% if within 6 hours

    const refundAmount = parseFloat((booking.total_fare * refundRate).toFixed(2));

    // --- Cancel Booking and Promote Waitlist ---
    const result = await cancelBookingAndPromoteWaitlist(booking_id);

    // --- Record Cancellation ---
    const t = await db.sequelize.transaction();
    try {
      await Cancellation.create({
        booking_id: booking.id,
        refund_amount: refundAmount,
        cancellation_date: new Date(),
      }, { transaction: t });
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }

    // --- Send Email (non-blocking) ---
    try {
      const user = await User.findByPk(user_id);
      if (user?.email) {
        emailService.sendCancellationConfirmation(user.email, booking.pnr, refundAmount);
      }
    } catch (err) {
      console.warn('⚠️ Email sending failed:', err.message);
    }

    res.status(200).json({
      message: 'Booking cancelled successfully.',
      refundAmount,
      refundRate,
      promoted_count: result.promoted_count
    });

  } catch (error) {
    console.error('Cancellation error:', error);
    res.status(500).json({ message: `Cancellation failed: ${error.message}` });
  }
};