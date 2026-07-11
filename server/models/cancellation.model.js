module.exports = (sequelize, DataTypes) => {
  const Cancellation = sequelize.define('cancellation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'id',
      },
      unique: true,
    },
    cancellation_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    refund_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    tableName: 'cancellations',
    timestamps: false,
  });

  return Cancellation;
};