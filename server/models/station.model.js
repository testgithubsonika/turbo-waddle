module.exports = (sequelize, DataTypes) => {
  const Station = sequelize.define('station', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    station_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    station_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'stations',
    timestamps: true,
  });

  // Add association for RouteStation
  Station.associate = (models) => {
    Station.hasMany(models.RouteStation, {
      foreignKey: 'station_id',
    });
  };

  return Station;
};