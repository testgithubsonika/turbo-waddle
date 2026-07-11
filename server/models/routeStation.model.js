module.exports = (sequelize, DataTypes) => {
  const RouteStation = sequelize.define('route_station', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    route_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'routes',
        key: 'id',
      },
    },
    station_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stations',
        key: 'id',
      },
    },
    sequence_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    arrival_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    departure_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    distance_from_source_km: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'route_stations',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['route_id', 'sequence_no'],
      },
      {
        unique: true,
        fields: ['route_id', 'station_id'],
      },
    ],
  });

  return RouteStation;
};
