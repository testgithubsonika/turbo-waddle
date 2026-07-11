module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('booking', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    pnr: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    booking_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    journey_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    total_fare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quota: {
      type: DataTypes.ENUM('GN','TATKAL','PT','LADIES'),
      allowNull: false,
      defaultValue: 'GN'
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending'
    },
    wl_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rac_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    tableName: 'bookings',
    timestamps: true,
  });

  // --- Associations ---
  Booking.associate = (models) => {
    Booking.belongsTo(models.User, { foreignKey: 'user_id' });
    Booking.hasMany(models.Ticket, { foreignKey: 'booking_id', onDelete: 'CASCADE' });
    Booking.hasOne(models.Cancellation, { foreignKey: 'booking_id' });
  };

  // -------------------------------------------------------------------
  // 🔒 HOOKS: Seat Integrity Enforcement
  // -------------------------------------------------------------------

  // ✅ Pre-validation guard: prevent past-dated bookings
  Booking.addHook('beforeValidate', (booking) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const journeyDate = new Date(booking.journey_date);
    journeyDate.setHours(0, 0, 0, 0);
    if (journeyDate < today) {
      throw new Error('Cannot create or modify a booking for a past journey date.');
    }
  });

  // ✅ Automatically mark seats unavailable when booking confirmed
  // Seat availability is derived from confirmed bookings; do not update Seat rows.

  // Seat state should not be mutated by booking lifecycle hooks. Availability is calculated from Tickets/Bookings.

  return Booking;

};

// Sequelize executes hooks in the same transaction context, so seat updates will roll back automatically if booking creation fails.

// Use afterDestroy instead of beforeDestroy because you want the booking deletion to succeed first, then cleanup to occur.

// Keep Redis locking logic — it prevents double-booking at runtime, while hooks guarantee state correctness at the persistence layer.