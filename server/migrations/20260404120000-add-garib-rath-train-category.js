'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "ALTER TYPE \"enum_trains_category\" ADD VALUE IF NOT EXISTS 'GARIB_RATH';"
    );
  },

  async down(queryInterface, Sequelize) {
    // PostgreSQL does not support removing enum values directly.
    // If rollback is required, recreate the enum type and migrate the table.
  },
};
