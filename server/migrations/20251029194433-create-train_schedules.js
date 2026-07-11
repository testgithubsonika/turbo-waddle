'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('train_schedules', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      train_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'trains',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      day_of_week: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      departure_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      arrival_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('train_schedules');
  },
};
