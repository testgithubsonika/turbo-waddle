'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trains', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      train_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      train_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      route_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'routes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // prevents deletion of a route with assigned trains
      },
      fare_structure: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      base_fare_per_km: {
        type: Sequelize.DECIMAL(5,2),
        allowNull: false,
        defaultValue: 1.00,
      },
      category: {
        type: Sequelize.ENUM(
          'SUPERFAST',
          'EXPRESS',
          'MAIL',
          'PASSENGER',
          'RAJDHANI',
          'SHATABDI',
          'DURONTO',
          'GARIB_RATH'
        ),
        allowNull: false,
        defaultValue: 'EXPRESS',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('trains');
  },
};
