module.exports = (sequelize, DataTypes) => {
  const Seat = sequelize.define('seat', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    train_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'trains',
        key: 'id',
      },
    },
    coach: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    seat_number: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    class_type: {
      type: DataTypes.STRING(50), 
      allowNull: false,
    },
  }, {
    tableName: 'seats',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['train_id', 'coach', 'seat_number'],
      },
    ],
  });

  return Seat;
};