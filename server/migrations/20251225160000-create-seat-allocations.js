'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('seat_allocations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      seat_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'seats',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      booking_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'bookings',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      route_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'routes',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      journey_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      from_sequence: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      to_sequence: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex(
      'seat_allocations',
      ['seat_id', 'journey_date', 'route_id'],
      { name: 'idx_seat_date_route' }
    );

    await queryInterface.addIndex(
      'seat_allocations',
      ['booking_id'],
      { name: 'idx_booking_id' }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('seat_allocations');
  },
};
