module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('ticket', {
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
    },
    seat_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'seats',
        key: 'id',
      },
    },
    passenger_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passenger_age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    passenger_gender: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  }, {
    tableName: 'tickets',
    timestamps: false,
  });

Ticket.associate = (models) => {
  Ticket.belongsTo(models.Booking, {
    foreignKey: 'booking_id',
    onDelete: 'CASCADE',
  });

  Ticket.belongsTo(models.Seat, {
    foreignKey: 'seat_id',
  });
};
// In models/ticket.js
// Seat availability is derived from confirmed bookings; do not update Seat rows in ticket hooks.

  return Ticket;
};

// flips immediately when tickets are deleted 
// (for example, due to partial cancellations):

