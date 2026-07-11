'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const existing = await queryInterface.sequelize.query(
      'SELECT COUNT(*)::int AS count FROM train_schedules',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existing[0].count > 0) {
      console.log('✅ Train schedules already seeded. Skipping...');
      return;
    }

    const trains = await queryInterface.sequelize.query(
      `SELECT id FROM trains ORDER BY id`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const schedules = [];

    const addMinutes = (time, minutesToAdd) => {
      const [hour, minute] = time.split(':').map(Number);
      const totalMinutes = (hour * 60 + minute + minutesToAdd) % 1440;
      const newHour = Math.floor(totalMinutes / 60);
      const newMinute = totalMinutes % 60;
      return `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;
    };

    for (const train of trains) {
      // deterministic staggered start time
      const baseHour = 5 + (train.id % 6); // 05:00 – 10:00
      const baseMinute = (train.id * 7) % 60;

      const departureTime = `${String(baseHour).padStart(2, '0')}:${String(baseMinute).padStart(2, '0')}`;
      const arrivalTime = addMinutes(departureTime, 120);

      for (let day = 0; day <= 6; day++) {
        schedules.push({
          train_id: train.id,
          day_of_week: day,
          departure_time: departureTime,
          arrival_time: arrivalTime,
        });
      }
    }

    await queryInterface.bulkInsert('train_schedules', schedules);
    console.log(`✅ Inserted ${schedules.length} train schedules`);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('train_schedules', null);
  },
};
