module.exports = (sequelize, DataTypes) => {
  const Route = sequelize.define('route', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    source_station_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    destination_station_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'routes',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['source_station_id', 'destination_station_id'],
        name: 'unique_route_stations'
      }
    ]
  });

  // Add association for RouteStation
  Route.associate = (models) => {
    Route.hasMany(models.RouteStation, {
      foreignKey: 'route_id',
      onDelete: 'CASCADE',
    });
  };

  return Route;
};