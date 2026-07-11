module.exports = (sequelize, DataTypes) => {
  const SeatAvailability = sequelize.define('seat_availability', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    train_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    journey_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    class_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    quota: {
      type: DataTypes.ENUM('GN', 'TATKAL', 'PT', 'LADIES'),
      allowNull: false,
    },
    total_seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    available_seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rac_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    rac_used: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    wl_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    wl_used: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    base_fare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quota_extra_fare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    booking_open_from: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    booking_open_to: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'seat_availability',
    timestamps: true,
    underscored: true,
  });

  SeatAvailability.associate = (models) => {
    SeatAvailability.belongsTo(models.Train, { foreignKey: 'train_id' });
  };

  return SeatAvailability;
};
