'use strict';

const fs = require('fs');
const path = require('path');
const SequelizeLib = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

let sequelize;
let Sequelize = SequelizeLib;

//
//if only db.js dont work then use this method otherwise no need of this
// // replace the "Prefer app's sequelize instance..." try block with this guarded version
const runningCli = (() => {
  // consider common CLI markers and env flags
  const argv = process.argv.join(' ');
  if (process.env.SEQUELIZE_CLI) return true;
  if (/\bsequelize(-cli)?\b/.test(argv)) return true;
  if (/\bdb:(migrate|seed|migrate:status|seed:all)\b/.test(argv)) return true;
  return false;
})();// try {
  
//

// Prefer app's sequelize instance (config/db.js), fall back to sequelize-cli config
try {
  if (!runningCli) {
  const dbModule = require(path.join(__dirname, '..', 'config', 'db.js'));
  if (dbModule && dbModule.sequelize) {
    sequelize = dbModule.sequelize;
     } else {
      throw new Error('no-app-sequelize');
    }
  } else {
    // force CLI to use config/config.js (fallback) to avoid app-specific env issues
    throw new Error('running-cli-fallback');
  }
} catch (e) {
  // fallback to sequelize-cli style config (config.js or config.json)
  let config;
  try {
    config = require(path.join(__dirname, '..', 'config', 'config.js'))[env];
  } catch (err) {
    config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
  }
  //
 config = config || {};
  config.dialect = config.dialect || process.env.DB_DIALECT || 'postgres';

  if (config.use_env_variable) {
    sequelize = new SequelizeLib(process.env[config.use_env_variable], config);
  } else {
    sequelize = new SequelizeLib(config.database, config.username, config.password, config);
  }
}

db.sequelize = sequelize;
db.Sequelize = SequelizeLib;
db.DataTypes = SequelizeLib.DataTypes;

// load model files (skip and backups)
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
  const model = require(path.join(__dirname, file))(sequelize, SequelizeLib.DataTypes);
  const originalName = model.name; // e.g. 'train_schedule' or 'user'
  // keep original
  db[originalName] = model;

  // camelCase: 'trainSchedule'
  const camelName = originalName.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  if (camelName && !db[camelName]) db[camelName] = model;

  // PascalCase: 'TrainSchedule'
  const pascalName = camelName.charAt(0).toUpperCase() + camelName.slice(1);
  if (pascalName && !db[pascalName]) db[pascalName] = model;

  // simple capitalized original (for 'user' -> 'User')
  const cap = originalName.charAt(0).toUpperCase() + originalName.slice(1);
  if (!db[cap]) db[cap] = model;
});

// If models define associate, call it (sequelize-cli pattern)
Object.keys(db).forEach(modelName => {
  if (db[modelName] && typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

// Recreate explicit associations from indexback.js (guarded)
try {
  if (db.Route && db.Station) {
    db.Route.belongsTo(db.Station, { as: 'sourceStation', foreignKey: 'source_station_id' });
    db.Route.belongsTo(db.Station, { as: 'destinationStation', foreignKey: 'destination_station_id' });
    db.Station.hasMany(db.Route, { as: 'departingRoutes', foreignKey: 'source_station_id' });
    db.Station.hasMany(db.Route, { as: 'arrivingRoutes', foreignKey: 'destination_station_id' });
  }

  if (db.Train && db.Route) {
    db.Train.belongsTo(db.Route, { foreignKey: 'route_id' });
    db.Route.hasMany(db.Train, { foreignKey: 'route_id' });
  }

  if (db.Train && db.TrainSchedule) {
    db.Train.hasMany(db.TrainSchedule, { foreignKey: 'train_id' });
    db.TrainSchedule.belongsTo(db.Train, { foreignKey: 'train_id' });
  }

  if (db.Train && db.Seat) {
    db.Train.hasMany(db.Seat, { foreignKey: 'train_id' });
    db.Seat.belongsTo(db.Train, { foreignKey: 'train_id' });
  }

  if (db.User && db.Booking) {
    db.User.hasMany(db.Booking, { foreignKey: 'user_id' });
    db.Booking.belongsTo(db.User, { foreignKey: 'user_id' });
  }

  if (db.Booking && db.Ticket) {
    db.Booking.hasMany(db.Ticket, { foreignKey: 'booking_id' });
    db.Ticket.belongsTo(db.Booking, { foreignKey: 'booking_id' });
  }

  if (db.Ticket && db.Seat) {
    db.Ticket.belongsTo(db.Seat, { foreignKey: 'seat_id' });
    db.Seat.hasMany(db.Ticket, { foreignKey: 'seat_id' });
  }

  if (db.Booking && db.Cancellation) {
    db.Booking.hasOne(db.Cancellation, { foreignKey: 'booking_id' });
    db.Cancellation.belongsTo(db.Booking, { foreignKey: 'booking_id' });
  }
} catch (err) {
  // ignore errors while CLI introspects models (some models may be missing)
}

module.exports = db;
