const express = require('express');
const router = express.Router();
const { acquireLock, releaseLock } = require('./lock');
const dbPool = require('./pg');
// const dbPool = require('../models').sequelize; // assuming Sequelize is used
const bookingQueue = require('./bookingQueue');

// Reserve endpoint: simplified and focused on core pattern: locks -> db tx -> enqueue
router.post('/reserve', async (req, res) => {
  const { userId, trainId, seats } = req.body; // seats: [{ coach, seat_no }]
  if (!userId || !trainId || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ error: 'invalid_payload' });
  }

  const lockKeys = [];
  const lockVals = [];
  try {
    // 1) Acquire locks for each seat
    for (const s of seats) {
      const key = `lock:seat:${trainId}:${s.coach}:${s.seat_no}`;
      const lock = await acquireLock(key, 10000);
      if (!lock) {
        // failed to acquire; release any acquired locks
        for (let i = 0; i < lockKeys.length; i++) {
          await releaseLock(lockKeys[i], lockVals[i]);
        }
        return res.status(409).json({ error: 'seat_locked' });
      }
      lockKeys.push(lock.key);
      lockVals.push(lock.value);
    }

    // 2) Begin Postgres transaction to verify & create booking
    const client = await dbPool.connect();
    try {
      await client.query('BEGIN');
      // verify seats are free (FOR UPDATE to lock rows)
      const seatNos = seats.map(s => s.seat_no);
      const { rows } = await client.query(
        `SELECT seat_id, seat_no, coach FROM seats WHERE train_id = $1 AND coach = $2 AND seat_no = ANY($3) FOR UPDATE`,
        [trainId, seats[0].coach, seatNos]
      );
      // Basic check: ensure number of rows equals seats requested
      if (rows.length !== seats.length) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'seat_not_found' });
      }
      // Check if any seat already booked
      const checkRes = await client.query(
        `SELECT 1 FROM bookings WHERE train_id = $1 AND coach = $2 AND seat_no = ANY($3) AND status IN ('confirmed','pending')`,
        [trainId, seats[0].coach, seatNos]
      );
      if (checkRes.rowCount > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({ error: 'seat_already_booked' });
      }

      // Insert booking (pending)
      const insertRes = await client.query(
        `INSERT INTO bookings (user_id, train_id, coach, seat_no, status, created_at) VALUES ($1, $2, $3, $4, 'pending', NOW()) RETURNING id`,
        [userId, trainId, seats[0].coach, seatNos[0]]
      );
      const bookingId = insertRes.rows[0].id;

      await client.query('COMMIT');

      // 3) Update Redis counters (avail) optionally and enqueue background jobs
      try {
        await Promise.all(seats.map(s => dbPool.query('SELECT 1'))); // placeholder if needed
        // Enqueue confirmation email
        await bookingQueue.add('sendConfirmation', { bookingId }, { attempts: 3, backoff: { type: 'exponential', delay: 5000 } });
        await bookingQueue.add('updateAnalytics', { bookingId }, { removeOnComplete: true });
      } catch (qerr) {
        console.error('Queueing failed', qerr);
        // Do not fail the booking because queueing failed; consider alerting
      }

      return res.status(201).json({ bookingId });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('DB transaction error', err);
      return res.status(500).json({ error: 'booking_failed' });
    } finally {
      client.release();
    }
  } finally {
    // release locks in finally to ensure they are removed
    for (let i = 0; i < lockKeys.length; i++) {
      try { await releaseLock(lockKeys[i], lockVals[i]); } catch (e) { console.error('release lock error', e); }
    }
  }
});

module.exports = router;
