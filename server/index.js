const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB, sequelize } = require('./config/db');
const db = require('./models');

const app = express();

// --- CORS ---
const allowedFrontendOrigins = [
  'http://localhost:5000',
  'http://localhost:5174',
  "https://turbo-waddle-phi.vercel.app",
  'http://localhost:5173', // Vite default dev port
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedFrontendOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
}));

console.log('CORS allowed origins:', allowedFrontendOrigins);
console.log("Blocked Origin:", origin);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Health check ---
app.get('/', (req, res) => {
  res.json({ message: 'Train Booking API is running' });
});

// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', message: 'Backend is healthy' });
// });

// --- Register all routes ---
require('./routes/auth.routes')(app);
require('./routes/train.routes')(app);
require('./routes/booking.routes')(app);
require('./routes/profile.routes')(app);

// --- 404 catch-all ---
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method,
    availableRoutes: [
      'POST /api/auth/signup',
      'POST /api/auth/signin',
      'POST /api/auth/google-signin',
      'GET /api/trains/stations',
      'GET /api/trains/availability',
      'POST /api/trains/search',
      'GET /api/trains/:id',
      'GET /api/bookings/history',
      'POST /api/bookings/book',
      'POST /api/bookings/:booking_id/cancel',
      'GET /api/profile',
      'PUT /api/profile/update',
      'PUT /api/profile/password',
      'DELETE /api/profile/delete',
    ]
  });
});

const PORT = 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}.`);
  await connectDB();
  db.sequelize.sync({ alter: true })
    .then(() => console.log('Database synced successfully.'))
    .catch((err) => console.error('Failed to sync database:', err.message));
});
module.exports = app;
//database url then bullmq workers,
//access token update with in frontend 
//index with main in vite not create app
//Email exists (400): { "message": "Email already in use." }
// Server error (500): { "message": "error details" }



