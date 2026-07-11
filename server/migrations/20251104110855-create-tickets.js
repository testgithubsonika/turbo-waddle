'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tickets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      booking_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'bookings',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      seat_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'seats',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // prevents seat deletion if ticket exists
      },
      passenger_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      passenger_age: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      passenger_gender: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tickets');
  },
};
