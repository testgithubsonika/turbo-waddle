'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const existingSeats = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM seats',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingSeats[0].count > 0) {
      console.log('✅ Seats already seeded. Skipping...');
      return;
    }

    const trains = await queryInterface.sequelize.query(
      'SELECT id FROM trains',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (trains.length === 0) {
      console.log('⚠️ No trains found. Please seed trains first.');
      return;
    }

    const seats = [];

    const coaches = [
      'S1', 'S2',     // Sleeper
      'B1',           // 3A
      'A1',           // 2A
      'C1',           // CC
      'E1',           // EC
    ];

    const classTypes = {
      S: 'Sleeper',
      B: '3A',
      A: '2A',
      C: 'CC',
      E: 'EC',
    };

    trains.forEach(train => {
      coaches.forEach(coach => {
        const classType = classTypes[coach[0]];
        for (let i = 1; i <= 30; i++) {
          seats.push({
            train_id: train.id,
            coach,
            seat_number: `${coach}-${i}`,
            class_type: classType,
          });
        }
      });
    });

    await queryInterface.bulkInsert('seats', seats);
    console.log(`✅ Inserted ${seats.length} seats.`);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('seats', null);
  }
};
