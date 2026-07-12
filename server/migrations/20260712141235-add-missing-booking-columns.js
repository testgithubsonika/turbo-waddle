'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn('bookings', 'train_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'trains',
        key: 'id'
      }
    });

    await queryInterface.addColumn('bookings', 'class_type', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });

    await queryInterface.addColumn('bookings', 'quota', {
      type: Sequelize.ENUM('GN', 'TATKAL', 'PT', 'LADIES'),
      allowNull: false,
      defaultValue: 'GN'
    });

    await queryInterface.addColumn('bookings', 'wl_number', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('bookings', 'rac_number', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('bookings', 'rac_number');
    await queryInterface.removeColumn('bookings', 'wl_number');
    await queryInterface.removeColumn('bookings', 'quota');
    await queryInterface.removeColumn('bookings', 'class_type');
    await queryInterface.removeColumn('bookings', 'train_id');

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_bookings_quota";'
    );
  }
};