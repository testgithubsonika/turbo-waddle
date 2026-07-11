module.exports = (sequelize, DataTypes) => {
  const SeatAllocation = sequelize.define('seat_allocation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    seat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'seats',
        key: 'id',
      },
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'id',
      },
    },
    journey_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    route_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'routes',
        key: 'id',
      },
    },
    from_sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    to_sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'seat_allocations',
    timestamps: true,
    indexes: [
      {
        fields: ['seat_id', 'journey_date', 'route_id'],
        name: 'idx_seat_date_route'
      },
      {
        fields: ['booking_id'],
        name: 'idx_booking_id'
      }
    ]
  });

  SeatAllocation.associate = (models) => {
    SeatAllocation.belongsTo(models.Seat, { foreignKey: 'seat_id' });
    SeatAllocation.belongsTo(models.Booking, { foreignKey: 'booking_id' });
  };

  return SeatAllocation;
};
