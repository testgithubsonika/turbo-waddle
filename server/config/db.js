require('dotenv').config();
console.log("DATABASE_URL =", process.env.DATABASE_URL);
const { Sequelize } = require("sequelize");

// // Initialize Sequelize once
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});
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

// Connection check helper
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Export both in one object
module.exports = { sequelize, connectDB };
