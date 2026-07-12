
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {


  async up (queryInterface, Sequelize) {
     // Skip if already seeded
    // const existing = await queryInterface.sequelize.query(
    //   'SELECT COUNT(*) AS count FROM route_stations;',
    //   { type: Sequelize.QueryTypes.SELECT }
    // );

    // if (Number(existing[0].count) > 0) {
    //   console.log('✅ Route stations already seeded. Skipping...');
    //   return;
    // }
    await queryInterface.createTable('route_stations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      route_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'routes',
          key: 'id',
        },
      },
      station_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'stations',
          key: 'id',
        },
      },
      sequence_no: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      arrival_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      departure_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      distance_from_source_km: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      uniqueKeys: {
        route_sequence: {
          fields: ['route_id', 'sequence_no'],
        },
        route_station: {
          fields: ['route_id', 'station_id'],
        },
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('route_stations');
  }
};
