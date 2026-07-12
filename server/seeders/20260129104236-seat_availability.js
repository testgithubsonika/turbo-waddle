'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const DAYS_AHEAD = 7; // seed for next 30 days

    const trains = await queryInterface.sequelize.query(
      `SELECT id, fare_structure FROM trains`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!trains.length) {
      console.log('⚠️ No trains found. Seed trains first.');
      return;
    }

    const rows = [];
    const today = new Date();

    for (const train of trains) {
      const fareStructure =
        typeof train.fare_structure === 'string'
          ? JSON.parse(train.fare_structure)
          : (train.fare_structure || {});

      const classTypes = Object.keys(fareStructure);

      for (let d = 0; d < DAYS_AHEAD; d++) {
        const journeyDate = new Date(today);
        journeyDate.setDate(today.getDate() + d);

        for (const classType of classTypes) {
          const baseFare = Number(fareStructure[classType]);

          // ---- GN QUOTA ----
          rows.push({
            train_id: train.id,
            journey_date: journeyDate,
            class_type: classType,
            quota: 'GN',
            total_seats: 72,
            available_seats: 72,
            rac_limit: 12,
            rac_used: 0,
            wl_limit: 50,
            wl_used: 0,
            base_fare: baseFare,
            quota_extra_fare: 0,
            booking_open_from: new Date(today),
            booking_open_to: journeyDate,
            created_at: new Date(),
            updated_at: new Date(),
          });

          // ---- TATKAL (opens 1 day before) ----
          const tatkalOpen = new Date(journeyDate);
          tatkalOpen.setDate(journeyDate.getDate() - 1);
          tatkalOpen.setHours(10, 0, 0, 0);

          rows.push({
            train_id: train.id,
            journey_date: journeyDate,
            class_type: classType,
            quota: 'TATKAL',
            total_seats: 20,
            available_seats: 20,
            rac_limit: 0,
            rac_used: 0,
            wl_limit: 20,
            wl_used: 0,
            base_fare: baseFare,
            quota_extra_fare: 400,
            booking_open_from: tatkalOpen,
            booking_open_to: journeyDate,
            created_at: new Date(),
            updated_at: new Date(),
          });

          // ---- PREMIUM TATKAL ----
          rows.push({
            train_id: train.id,
            journey_date: journeyDate,
            class_type: classType,
            quota: 'PT',
            total_seats: 10,
            available_seats: 10,
            rac_limit: 0,
            rac_used: 0,
            wl_limit: 0,
            wl_used: 0,
            base_fare: baseFare,
            quota_extra_fare: 800,
            booking_open_from: tatkalOpen,
            booking_open_to: journeyDate,
            created_at: new Date(),
            updated_at: new Date(),
          });

          // ---- LADIES QUOTA ----
          rows.push({
            train_id: train.id,
            journey_date: journeyDate,
            class_type: classType,
            quota: 'LADIES',
            total_seats: 6,
            available_seats: 6,
            rac_limit: 2,
            rac_used: 0,
            wl_limit: 10,
            wl_used: 0,
            base_fare: baseFare,
            quota_extra_fare: 0,
            booking_open_from: new Date(today),
            booking_open_to: journeyDate,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      }
    }

    await queryInterface.bulkInsert('seat_availability', rows);
    console.log(`✅ Seeded ${rows.length} seat_availability rows`);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('seat_availability', null);
  },
};
