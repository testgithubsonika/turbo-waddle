<!-- 'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Check if train schedules already exist
    const existingSchedules = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM train_schedules;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingSchedules[0].count > 0) {
      console.log('✅ Train schedules already seeded. Skipping...');
      return;
    }

    // Check existing trains
    const existingTrains = await queryInterface.sequelize.query(
      'SELECT id FROM trains;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const existingTrainIds = existingTrains.map(t => t.id);

    const schedulesData = [
      // --- Existing 10 ---
      { train_id: 1, day_of_week: 0, departure_time: '17:00:00', arrival_time: '08:00:00' }, // Sun
      { train_id: 1, day_of_week: 3, departure_time: '17:00:00', arrival_time: '08:00:00' }, // Wed
      { train_id: 1, day_of_week: 5, departure_time: '17:00:00', arrival_time: '08:00:00' }, // Fri
      
      { train_id: 2, day_of_week: 1, departure_time: '16:30:00', arrival_time: '07:30:00' }, // Mon
      { train_id: 2, day_of_week: 4, departure_time: '16:30:00', arrival_time: '07:30:00' }, // Thu
      { train_id: 2, day_of_week: 6, departure_time: '16:30:00', arrival_time: '07:30:00' }, // Sat

      { train_id: 3, day_of_week: 2, departure_time: '14:00:00', arrival_time: '09:00:00' }, // Tue
      { train_id: 3, day_of_week: 4, departure_time: '14:00:00', arrival_time: '09:00:00' }, // Thu
      
      { train_id: 4, day_of_week: 1, departure_time: '20:00:00', arrival_time: '06:00:00' }, // Mon
      { train_id: 4, day_of_week: 5, departure_time: '20:00:00', arrival_time: '06:00:00' }, // Fri

      // --- 40 New Schedules (train_id 5–50) ---
      { train_id: 5, day_of_week: 0, departure_time: '06:00:00', arrival_time: '12:30:00' },
      { train_id: 5, day_of_week: 3, departure_time: '06:00:00', arrival_time: '12:30:00' },

      { train_id: 6, day_of_week: 1, departure_time: '15:00:00', arrival_time: '06:00:00' },
      { train_id: 6, day_of_week: 4, departure_time: '15:00:00', arrival_time: '06:00:00' },

      { train_id: 7, day_of_week: 2, departure_time: '10:30:00', arrival_time: '18:00:00' },
      { train_id: 7, day_of_week: 5, departure_time: '10:30:00', arrival_time: '18:00:00' },

      { train_id: 8, day_of_week: 3, departure_time: '21:00:00', arrival_time: '09:00:00' },
      { train_id: 8, day_of_week: 6, departure_time: '21:00:00', arrival_time: '09:00:00' },

      { train_id: 9, day_of_week: 0, departure_time: '07:30:00', arrival_time: '13:30:00' },
      { train_id: 9, day_of_week: 2, departure_time: '07:30:00', arrival_time: '13:30:00' },

      { train_id: 10, day_of_week: 1, departure_time: '19:00:00', arrival_time: '09:00:00' },
      { train_id: 10, day_of_week: 5, departure_time: '19:00:00', arrival_time: '09:00:00' },

      { train_id: 11, day_of_week: 2, departure_time: '22:00:00', arrival_time: '10:00:00' },
      { train_id: 11, day_of_week: 6, departure_time: '22:00:00', arrival_time: '10:00:00' },

      { train_id: 12, day_of_week: 0, departure_time: '08:30:00', arrival_time: '18:00:00' },
      { train_id: 12, day_of_week: 3, departure_time: '08:30:00', arrival_time: '18:00:00' },

      { train_id: 13, day_of_week: 1, departure_time: '11:00:00', arrival_time: '23:30:00' },
      { train_id: 13, day_of_week: 4, departure_time: '11:00:00', arrival_time: '23:30:00' },

      { train_id: 14, day_of_week: 2, departure_time: '09:00:00', arrival_time: '17:30:00' },
      { train_id: 14, day_of_week: 5, departure_time: '09:00:00', arrival_time: '17:30:00' },

      { train_id: 15, day_of_week: 0, departure_time: '18:00:00', arrival_time: '08:00:00' },
      { train_id: 15, day_of_week: 3, departure_time: '18:00:00', arrival_time: '08:00:00' },

      { train_id: 16, day_of_week: 1, departure_time: '05:00:00', arrival_time: '13:00:00' },
      { train_id: 16, day_of_week: 4, departure_time: '05:00:00', arrival_time: '13:00:00' },

      { train_id: 17, day_of_week: 2, departure_time: '16:00:00', arrival_time: '06:00:00' },
      { train_id: 17, day_of_week: 6, departure_time: '16:00:00', arrival_time: '06:00:00' },

      { train_id: 18, day_of_week: 0, departure_time: '07:00:00', arrival_time: '20:00:00' },
      { train_id: 18, day_of_week: 3, departure_time: '07:00:00', arrival_time: '20:00:00' },

      { train_id: 19, day_of_week: 1, departure_time: '19:30:00', arrival_time: '07:30:00' },
      { train_id: 19, day_of_week: 5, departure_time: '19:30:00', arrival_time: '07:30:00' },

      { train_id: 20, day_of_week: 2, departure_time: '13:00:00', arrival_time: '23:00:00' },
      { train_id: 20, day_of_week: 6, departure_time: '13:00:00', arrival_time: '23:00:00' },

      { train_id: 21, day_of_week: 0, departure_time: '09:30:00', arrival_time: '16:30:00' },
      { train_id: 21, day_of_week: 3, departure_time: '09:30:00', arrival_time: '16:30:00' },

      { train_id: 22, day_of_week: 1, departure_time: '21:30:00', arrival_time: '10:30:00' },
      { train_id: 22, day_of_week: 5, departure_time: '21:30:00', arrival_time: '10:30:00' },

      { train_id: 23, day_of_week: 2, departure_time: '06:00:00', arrival_time: '14:30:00' },
      { train_id: 23, day_of_week: 4, departure_time: '06:00:00', arrival_time: '14:30:00' },

      { train_id: 24, day_of_week: 0, departure_time: '12:00:00', arrival_time: '23:00:00' },
      { train_id: 24, day_of_week: 3, departure_time: '12:00:00', arrival_time: '23:00:00' },

      { train_id: 25, day_of_week: 1, departure_time: '15:30:00', arrival_time: '04:00:00' },
      { train_id: 25, day_of_week: 4, departure_time: '15:30:00', arrival_time: '04:00:00' },

      { train_id: 26, day_of_week: 2, departure_time: '07:00:00', arrival_time: '18:30:00' },
      { train_id: 26, day_of_week: 6, departure_time: '07:00:00', arrival_time: '18:30:00' },

      { train_id: 27, day_of_week: 0, departure_time: '08:00:00', arrival_time: '19:00:00' },
      { train_id: 27, day_of_week: 3, departure_time: '08:00:00', arrival_time: '19:00:00' },

      { train_id: 28, day_of_week: 1, departure_time: '18:00:00', arrival_time: '08:30:00' },
      { train_id: 28, day_of_week: 5, departure_time: '18:00:00', arrival_time: '08:30:00' },

      { train_id: 29, day_of_week: 2, departure_time: '10:00:00', arrival_time: '21:00:00' },
      { train_id: 29, day_of_week: 4, departure_time: '10:00:00', arrival_time: '21:00:00' },

      { train_id: 30, day_of_week: 0, departure_time: '19:30:00', arrival_time: '06:30:00' },
      { train_id: 30, day_of_week: 3, departure_time: '19:30:00', arrival_time: '06:30:00' },

      // Trains 31–50 (short-distance daily trains)
      ...Array.from({ length: 20 }, (_, i) => {
        return {
          train_id: i + 31,
          day_of_week: i % 7,
          departure_time: '07:00:00',
          arrival_time: '12:00:00'
        };
      })
    ];

    // Filter schedules for existing trains only
    const validSchedules = schedulesData.filter(s => existingTrainIds.includes(s.train_id));

    await queryInterface.bulkInsert('train_schedules', validSchedules, {});

    console.log(`✅ Inserted ${validSchedules.length} train schedules for existing trains.`);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('train_schedules', null, {});
  }
}; -->
