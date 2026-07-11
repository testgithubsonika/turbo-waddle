'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('seat_availability', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      train_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'trains', key: 'id' },
        onDelete: 'CASCADE',
      },

      journey_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      class_type: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },

      quota: {
        type: Sequelize.ENUM('GN', 'TATKAL', 'PT', 'LADIES'),
        allowNull: false,
      },

      total_seats: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      available_seats: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      rac_limit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      rac_used: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      wl_limit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      wl_used: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      base_fare: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      quota_extra_fare: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },

      booking_open_from: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      booking_open_to: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addIndex('seat_availability', [
      'train_id',
      'journey_date',
      'class_type',
      'quota',
    ], {
      unique: true,
      name: 'uniq_seat_availability_train_date_class_quota',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('seat_availability');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_seat_availability_quota";'
    );
  },
};
