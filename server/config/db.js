// const { Sequelize } = require('sequelize');
const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: "postgres",   // or "mysql" depending on your DB
// });

require('dotenv').config();
// const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});
module.exports = sequelize;

//Force CLI to use the this config:
//npx sequelize-cli db:seed:all --config config/config.js

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: process.env.DB_DIALECT,
//     logging: false, 
//   }
// );

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };