const db = require('../models');
const { Op } = require('sequelize');

const Station = db.Station;
const Train = db.Train;
const Route = db.Route;
const TrainSchedule = db.TrainSchedule;
const Seat = db.Seat;
const Ticket = db.Ticket;
const Booking = db.Booking;

function normalizeFareStructure(raw) {
  if (!raw) return {};
  if (typeof raw === 'object') return raw;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse fare_structure:', raw);
    return {};
  }
}

// Search trains with pagination and date filtering
exports.searchTrains = async (req, res) => {
  try {
    console.log('========== SEARCH CONTROLLER ==========');
    console.log('Controller version: AI Enabled');

    const { source, destination, date } = req.body || req.query;

    if (!source || !destination || !date) {
      return res.status(400).json({ message: 'Source, destination, date required' });
    }

    const journeyDate = new Date(date);
    const dayOfWeek = journeyDate.getDay();

    const sourceStation = await Station.findOne({ where: { station_code: source }});
    const destStation = await Station.findOne({ where: { station_code: destination }});

    console.log(`🔍 Searching for routes from ${source}(ID:${sourceStation?.id}) to ${destination}(ID:${destStation?.id})`);

    if (!sourceStation || !destStation) {
      console.error('❌ Station not found:', { source, destination, sourceStation, destStation });
      return res.status(404).json({ message: 'Station not found' });
    }

    // 🔥 CORE QUERY
    const routes = await db.sequelize.query(`
      SELECT r.id AS route_id,
             rs1.sequence_no AS src_seq,
             rs2.sequence_no AS dest_seq,
             rs1.distance_from_source_km AS src_dist,
             rs2.distance_from_source_km AS dest_dist
      FROM routes r
      JOIN route_stations rs1 ON rs1.route_id = r.id
      JOIN route_stations rs2 ON rs2.route_id = r.id
      WHERE rs1.station_id = :src
        AND rs2.station_id = :dst
        AND rs1.sequence_no < rs2.sequence_no
    `, {
      replacements: {
        src: sourceStation.id,
        dst: destStation.id
      },
      type: db.Sequelize.QueryTypes.SELECT
    });

    console.log(`📍 Found ${routes.length} routes for ${source}->${destination}`);
    if (routes.length) {
      console.log('Routes:', JSON.stringify(routes, null, 2));
    }

    if (!routes.length) {
      console.error('❌ No routes found. Checking database...');
      const allRouteStations = await db.sequelize.query(
        'SELECT COUNT(*) as count FROM route_stations',
        { type: db.Sequelize.QueryTypes.SELECT }
      );
      console.log('Total route_stations in DB:', allRouteStations[0]);
      return res.status(404).json({ message: 'No routes found' });
    }

    const routeIds = routes.map(r => r.route_id);
    console.log(`🚄 Looking for schedules on day ${dayOfWeek} for routes:`, routeIds);

    const schedules = await TrainSchedule.findAll({
      where: { day_of_week: dayOfWeek },
      include: [{
        model: Train,
        where: { route_id: routeIds },
        attributes: ['id', 'train_name', 'train_number', 'route_id', 'base_fare_per_km', 'fare_structure', 'category'],
      }],
      order: [['departure_time', 'ASC']]
    });

    console.log(`🚂 Found ${schedules.length} train schedules`);

    // Attach distance info (SAFE)
    let trains = schedules
      .map(s => {
        const routeInfo = routes.find(
          r => r.route_id === s.train.route_id
        );

        // 🚨 VERY IMPORTANT GUARD
        if (!routeInfo) {
          console.warn(
            '⚠️ Skipping train due to missing routeInfo',
            {
              train_id: s.train.id,
              train_route_id: s.train.route_id
            }
          );
          return null;
        }

        return {
          train_id: s.train.id,
          train_name: s.train.train_name,
          train_number: s.train.train_number,
          departure_time: s.departure_time,
          arrival_time: s.arrival_time,
          route_id: s.train.route_id,
          from_sequence: routeInfo.src_seq,
          to_sequence: routeInfo.dest_seq,
          distance_km: routeInfo.dest_dist - routeInfo.src_dist,
          base_fare_per_km: s.train.base_fare_per_km,
          trainType: s.train.category,
          available_classes: Object.keys(
            normalizeFareStructure(s.train.fare_structure || {})
          )
        };
      })
      .filter(Boolean); // 🔥 removes null entries

    // Fetch predictions for each train/class combination using batch API
    const { sendRtcPrediction, buildRtcPredictionPayload } = require('../services/rtcPredictionService');
    const predictionLookup = [];
    const predictionPayloads = [];

    for (const train of trains) {
      for (const classType of train.available_classes) {
        const totalSeats = await db.Seat.count({
          where: { train_id: train.train_id, class_type: classType }
        });

        const bookedSeats = await db.sequelize.query(
          `SELECT COUNT(t.id) AS count
           FROM tickets t
           JOIN bookings b ON t.booking_id = b.id
           WHERE b.journey_date = :date
             AND b.status = 'CNF'
             AND t.seat_id IN (SELECT id FROM seats WHERE train_id = :train_id AND class_type = :class_type)
          `,
          {
            replacements: { date, train_id: train.train_id, class_type: classType },
            type: db.Sequelize.QueryTypes.SELECT,
          }
        );

        const availableSeats = Math.max(0, totalSeats - (bookedSeats[0]?.count || 0));

        const payload = buildRtcPredictionPayload({
          train: { category: train.trainType },
          classType,
          quota: 'GN',
          availability: {
            available_seats: availableSeats,
            rac_used: 0,
            rac_limit: 2,
            wl_used: 0,
          }
        });

        predictionLookup.push({ train_id: train.train_id, classType, availableSeats });
        predictionPayloads.push(payload);
      }
    }

    const predictionResults = await sendRtcPrediction(predictionPayloads) || [];

    console.log('Prediction payloads:');
    console.log(JSON.stringify(predictionPayloads, null, 2));
    console.log('Prediction results:');
    console.log(JSON.stringify(predictionResults, null, 2));

    const predictionByKey = predictionLookup.reduce((acc, entry, idx) => {
      const prediction = Array.isArray(predictionResults) ? predictionResults[idx] : null;
      acc[`${entry.train_id}:${entry.classType}`] = prediction?.probability ?? null;
      return acc;
    }, {});

    trains = trains.map((train) => ({
      ...train,
      classes: train.available_classes.map((classType) => ({
        class: classType,
        probability: predictionByKey[`${train.train_id}:${classType}`],
      })),
    }));

    console.log('Final response payload:');
    console.log(JSON.stringify(trains, null, 2));

    res.json({ trains });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Search failed' });
  }
};

exports.searchTrainsWithPrediction = async (req, res) => {
  // searchTrains already enriches results with prediction data
  return exports.searchTrains(req, res);
};

exports.getAvailableSeats = async (trainId, classType, date, routeId, fromSeq, toSeq) => {
  // Overlap rule: existing.from < requested.to AND existing.to > requested.from
  return await Seat.findAll({
    where: {
      train_id: trainId,
      class_type: classType,
      id: {
        [Op.notIn]: db.sequelize.literal(`
          (
            SELECT DISTINCT sa.seat_id
            FROM seat_allocations sa
            WHERE sa.journey_date = '${date}'
              AND sa.route_id = ${routeId}
              AND sa.from_sequence < ${toSeq}
              AND sa.to_sequence > ${fromSeq}
          )
        `)
      }
    },
    attributes: ['id', 'seat_number', 'coach', 'class_type'],
    raw: true
  });
};

// Get all stations (used for dropdowns)
exports.getStations = async (req, res) => {
  try {
    const stations = await Station.findAll({
      attributes: ['id', 'station_name', 'station_code', 'city'],
      order: [['station_name', 'ASC']],
    });

    console.log(`✅ Fetched ${stations.length} stations`);
    return res.json(stations);
  } catch (error) {
    console.error('❌ Error fetching stations:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get specific train details with seat availability
exports.getTrainById = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, class_type } = req.query;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'Invalid train ID.' });
    }

    const train = await Train.findByPk(id, {
      attributes: ['id', 'train_name', 'train_number', 'route_id', 'fare_structure', 'base_fare_per_km'],
    });

    if (!train) {
      return res.status(404).json({ message: 'Train not found.' });
    }

    const fareStructure = normalizeFareStructure(train.fare_structure);
    console.log(`📋 getTrainById ${id} fare_structure:`, fareStructure);

    const available_classes = Object.keys(fareStructure);

    let availableSeats = null;
    if (date && class_type) {
      const seats = await getAvailableSeatsForTrain(id, class_type, date);
      availableSeats = seats;
    }

    // Include base_fare_per_km and (optionally) computed fares when source/destination provided
    const baseFarePerKm = Number(train.base_fare_per_km || 1.00);
    let computed_fares = null;
    if (req.query.source && req.query.destination) {
      const srcStation = await Station.findOne({ where: { station_code: req.query.source.toUpperCase() } });
      const dstStation = await Station.findOne({ where: { station_code: req.query.destination.toUpperCase() } });
      if (srcStation && dstStation) {
        const srcRs = await db.RouteStation.findOne({ where: { route_id: train.route_id, station_id: srcStation.id }, attributes: ['distance_from_source_km'], raw: true });
        const dstRs = await db.RouteStation.findOne({ where: { route_id: train.route_id, station_id: dstStation.id }, attributes: ['distance_from_source_km'], raw: true });
        const distanceKm = Math.max(0, (dstRs?.distance_from_source_km || 0) - (srcRs?.distance_from_source_km || 0));
        const defaultMultipliers = { SLEEPER: 1.0, SL: 1.0, '3A': 2.5, '2A': 3.5 };
        computed_fares = {};
        for (const cls of available_classes) {
          const key = String(cls).toUpperCase();
          let classMultiplier = defaultMultipliers[key] ?? 1.0;
          const fsVal = fareStructure[cls];
          if (fsVal && typeof fsVal === 'object' && fsVal.multiplier) classMultiplier = Number(fsVal.multiplier);
          computed_fares[cls] = Number((distanceKm * baseFarePerKm * classMultiplier).toFixed(2));
        }
      }
    }

    return res.json({
      id: train.id,
      train_id: train.id,
      train_name: train.train_name,
      train_number: train.train_number,
      route_id: train.route_id,
      fare_structure: fareStructure,
      available_classes,
      base_fare_per_km: baseFarePerKm,
      computed_fares,
      available_seats: availableSeats,
    });
  } catch (error) {
    console.error('❌ Error fetching train:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.getTrainAvailability = async (req, res) => {
  try {
    const { train_id, date, class_type } = req.query;

    if (!train_id || !date || !class_type) {
      return res.status(400).json({ message: 'train_id, date, and class_type required.' });
    }

    // Compute availability dynamically: total seats for train+class minus booked seats for that journey_date
    const totalSeatsResult = await db.Seat.count({ where: { train_id, class_type } });

    // Count booked seats for CNF bookings on the given date
    const bookedSeatsResult = await db.sequelize.query(
      `SELECT COUNT(t.id) AS booked_count
       FROM tickets t
       JOIN bookings b ON t.booking_id = b.id
       WHERE b.journey_date = :date
         AND b.status = 'CNF'
         AND t.seat_id IN (SELECT id FROM seats WHERE train_id = :train_id AND class_type = :class_type)
      `,
      {
        replacements: { date, train_id, class_type },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const bookedCount = parseInt(bookedSeatsResult[0]?.booked_count || 0, 10);
    const availableSeats = Math.max(0, totalSeatsResult - bookedCount);

    return res.json({ available_seats: availableSeats });
  } catch (error) {
    console.error('❌ Error fetching availability:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// defaults (kept for reference if needed elsewhere)
// const defaultMultipliers = { SLEEPER:1.0, SL:1.0, '3A':2.5, '2A':3.5 };