const db = require('../models');
const { Op } = require('sequelize');

const Booking = db.Booking;
const SeatAvailability = db.SeatAvailability;
const SeatAllocation = db.SeatAllocation;
const Ticket = db.Ticket;

exports.cancelBookingAndPromoteWaitlist = async (bookingId) => {
  const t = await db.sequelize.transaction();

  try {
    const booking = await Booking.findByPk(bookingId, {
      include: [SeatAllocation],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!booking) throw new Error('Booking not found');

    const { train_id, journey_date, class_type, quota } = booking;

    // 1️⃣ Free seats if CNF
    if (booking.status === 'CNF') {
      await SeatAllocation.destroy({
        where: { booking_id: booking.id },
        transaction: t,
      });
    }

    // 2️⃣ Update availability
    const availability = await SeatAvailability.findOne({
      where: { train_id, journey_date, class_type, quota },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (booking.status === 'CNF') {
      availability.available_seats += 1;
    }
    else if (booking.status === 'RAC') {
      availability.rac_used -= 1;
    }
    else if (booking.status === 'WL') {
      availability.wl_used -= 1;
    }

    // 3️⃣ Promote RAC → CNF
    const racBooking = await Booking.findOne({
      where: {
        status: 'RAC',
        train_id,
        journey_date,
        class_type,
        quota,
      },
      order: [['rac_number', 'ASC']],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (racBooking) {
      racBooking.status = 'CNF';
      racBooking.rac_number = null;
      await racBooking.save({ transaction: t });
      availability.available_seats -= 1;
      availability.rac_used -= 1;
    }

    // 4️⃣ Promote WL → RAC
    const wlBooking = await Booking.findOne({
      where: {
        status: 'WL',
        train_id,
        journey_date,
        class_type,
        quota,
      },
      order: [['wl_number', 'ASC']],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (wlBooking && availability.rac_used < availability.rac_limit) {
      availability.rac_used += 1;
      wlBooking.status = 'RAC';
      wlBooking.rac_number = availability.rac_used;
      wlBooking.wl_number = null;
      await wlBooking.save({ transaction: t });
      availability.wl_used -= 1;
    }

    booking.status = 'CANCELLED';
    await booking.save({ transaction: t });
    await availability.save({ transaction: t });

    await t.commit();

    return {
      message: 'Booking cancelled and promotions applied',
    };
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
