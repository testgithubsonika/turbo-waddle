module.exports = (sequelize, DataTypes) => {
  const TrainSchedule = sequelize.define('train_schedule', {
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
    day_of_week: {
      type: DataTypes.INTEGER, 
      allowNull: false, 
    },
    departure_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    arrival_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  }, {
    tableName: 'train_schedules',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['train_id', 'day_of_week']
      }
    ]
  });

  TrainSchedule.associate = (models) => {
    TrainSchedule.belongsTo(models.Train, { foreignKey: 'train_id' });
  };

  return TrainSchedule;
};