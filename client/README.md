##Prerequisites
Node.js (v16 or higher)
PostgreSQL database running locally
Redis server running locally (for the booking queue system)

Setup Steps

1. Install Dependencies
Open two terminals
Terminal 1 (Backend):
cd server
npm install

Terminal 2 (Frontend):
cd client
npm install

###Database Setup

#PostgreSQL is running -> then run migrations -> seed the database:

''cd server
npx sequelize-cli
npm start
Terminal 2 (Frontend)
cd client
npm run dev
The frontend will start on http://localhost:5173 (default Vite port).