module.exports = (sequelize, DataTypes) => {
  const Train = sequelize.define('train', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    train_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    train_name: {
      type: DataTypes.STRING,
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
    fare_structure: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    base_fare_per_km: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false,
      defaultValue: 1.25,
    },
    category: {
      type: DataTypes.ENUM(
        'SUPERFAST',
        'EXPRESS',
        'MAIL',
        'PASSENGER',
        'RAJDHANI',
        'SHATABDI',
        'DURONTO',
        'GARIB_RATH'
      ),
      allowNull: false,
      defaultValue: 'EXPRESS',
    },
  }, {
    tableName: 'trains',
    timestamps: false,
  });

  Train.associate = (models) => {
    Train.belongsTo(models.Route, { foreignKey: 'route_id' });
  };

  return Train;
};