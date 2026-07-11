'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('seats', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
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
      coach: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      seat_number: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      class_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    });

    // Add composite unique constraint
    await queryInterface.addConstraint('seats', {
      fields: ['train_id', 'coach', 'seat_number'],
      type: 'unique',
      name: 'unique_train_coach_seat'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('seats');
  }
};
