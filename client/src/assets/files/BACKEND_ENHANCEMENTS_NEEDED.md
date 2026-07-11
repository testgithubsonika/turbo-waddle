# Backend Enhancement Requirements

## 1. Extend Train Search Response

### Current Response
```javascript
{
  "trains": [
    {
      "id": 102,
      "train_name": "Rajdhani Express",
      "train_number": "12001",
      "departure_time": "06:00",
      "arrival_time": "12:30",
      "distance_km": 350,
      "base_fare_per_km": 2.5
    }
  ]
}
```

### Enhanced Response (Add These Fields)
```javascript
{
  "trains": [
    {
      // ... existing fields above ...
      
      // ✨ NEW: Quota information
      "available_quotas": [
        {
          "quota": "GENERAL",
          "available_seats": 45,
          "availability_status": "AVAILABLE",
          "fare": 875
        },
        {
          "quota": "TATKAL",
          "available_seats": 10,
          "availability_status": "AVAILABLE",
          "fare": 1050,
          "opens_in_days": 1
        },
        {
          "quota": "PREMIUM",
          "available_seats": 0,
          "availability_status": "NOT_AVAILABLE",
          "fare": 1200,
          "wl_probability": 0.75
        }
      ],
      
      // ✨ NEW: Waitlist probability (ML-based)
      "wl_confirmation_probability": 0.85
    }
  ]
}
```

### Code Change Needed
**File:** `server/controllers/train.controller.js` → `searchTrains` function

```javascript
// After fetching trains, add:
const trainsWithQuotas = trains.map(train => ({
  ...train,
  available_quotas: getQuotasForTrain(train.id, searchDate),
  wl_confirmation_probability: calculateMLProbability(train)
}));
```

---

## 2. Add Seat Availability Endpoint

### New Route Needed
```javascript
// server/routes/train.routes.js
app.get(
  '/api/trains/:train_id/seats',
  [authJwt.verifyToken],
  controller.getAvailableSeats
);
```

### Response Format
```javascript
{
  "train_id": 102,
  "date": "2025-12-15",
  "class_type": "2A",
  "seats": [
    {
      "seat_number": "A1",
      "coach": "A",
      "class": "2A",
      "status": "available", // or "booked", "reserved"
      "price": 875
    },
    {
      "seat_number": "A2",
      "coach": "A",
      "class": "2A",
      "status": "booked",
      "price": 875
    },
    // ... more seats
  ],
  "stats": {
    "total": 72,
    "available": 45,
    "booked": 25,
    "reserved": 2
  }
}
```

### Implementation
```javascript
exports.getAvailableSeats = async (req, res) => {
  const { train_id } = req.params;
  const { date, class_type } = req.query;

  try {
    const seats = await Seat.findAll({
      where: { train_id, class_type },
      include: [{
        model: SeatAvailability,
        where: { date: new Date(date) },
        required: false
      }]
    });

    const formatted = seats.map(s => ({
      seat_number: s.seat_number,
      coach: s.coach,
      class: s.class_type,
      status: s.SeatAvailability?.is_available ? 'available' : 'booked',
      price: calculatePrice(s, class_type)
    }));

    res.status(200).json({
      train_id,
      date,
      class_type,
      seats: formatted,
      stats: {
        total: seats.length,
        available: formatted.filter(s => s.status === 'available').length,
        booked: formatted.filter(s => s.status === 'booked').length,
        reserved: formatted.filter(s => s.status === 'reserved').length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

## 3. Payment Integration Endpoint

### Route Needed
```javascript
// server/routes/booking.routes.js
app.post(
  '/api/bookings/:booking_id/payment',
  [authJwt.verifyToken],
  controller.initiatePayment
);

app.post(
  '/api/bookings/payment/verify',
  controller.verifyPayment
);
```

### Request/Response
```javascript
// Request to initiate payment
POST /api/bookings/123/payment
{
  "amount": 1750,
  "payment_method": "razorpay" // or "upi", "card"
}

// Response
{
  "order_id": "order_1234567890",
  "amount": 1750,
  "currency": "INR",
  "payment_url": "https://checkout.razorpay.com/...",
  "expires_in": 900 // seconds
}

// Verify payment
POST /api/bookings/payment/verify
{
  "order_id": "order_1234567890",
  "payment_id": "pay_987654321",
  "signature": "signature_hash"
}

// Response
{
  "status": "confirmed",
  "booking_id": 123,
  "booking_status": "paid"
}
```

---

## 4. Real-time Updates with WebSocket

### Add Socket.io Support
```javascript
// server/index.js
const socketIO = require('socket.io');
const io = socketIO(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room for specific train/date
  socket.on('subscribe-train', (trainId, date) => {
    socket.join(`train_${trainId}_${date}`);
  });

  // When seat becomes available
  socket.emit('seat-available', {
    train_id: trainId,
    seat_number: 'A1',
    date: date
  });
});
```

### Frontend Usage (React)
```javascript
// In BookingPage or wherever needed
import io from 'socket.io-client';

useEffect(() => {
  const socket = io('http://localhost:5000');
  socket.emit('subscribe-train', trainId, date);
  
  socket.on('seat-available', (data) => {
    console.log('Seat became available:', data);
    // Refresh available seats UI
  });

  return () => socket.disconnect();
}, [trainId, date]);
```

---

## 5. Cancellation with Refund Status

### Update Cancellation Response
```javascript
// Current: Just cancels booking
// New: Should return refund details

POST /api/bookings/123/cancel
{
  "refund_amount": 1400,
  "refund_status": "initiated", // or "processed", "failed"
  "cancellation_date": "2025-12-10T15:30:00Z",
  "refund_date": "2025-12-12", // Usually 5-7 days
  "reason": "User cancelled"
}
```

---

## 6. Admin Routes (Not Yet Implemented)

### Add These Endpoints
```javascript
// server/routes/admin.routes.js
const { authJwt } = require('../middleware');
const controller = require('../controllers/admin.controller');

module.exports = function(app) {
  // Only accessible to admins
  app.get(
    '/api/admin/dashboard',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getDashboard
  );

  app.get(
    '/api/admin/trains',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getTrainsForAdmin
  );

  app.post(
    '/api/admin/trains',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.createTrain
  );

  app.put(
    '/api/admin/trains/:train_id',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateTrain
  );
};
```

---

## Priority Order

1. **HIGH PRIORITY** (Blocks frontend development)
   - [ ] Extend `/trains/search` with quota info
   - [ ] Create `/trains/:train_id/seats` endpoint

2. **MEDIUM PRIORITY** (Improves booking flow)
   - [ ] Add payment endpoints (Razorpay)
   - [ ] Enhance cancellation response with refund status
   - [ ] Add pagination to `/bookings/history`

3. **LOW PRIORITY** (Nice to have)
   - [ ] WebSocket for real-time updates
   - [ ] Admin routes and dashboard
   - [ ] Analytics endpoints

---

## Testing Commands

```bash
# Test quota endpoint
curl -X POST http://localhost:5000/api/trains/search \
  -H "Content-Type: application/json" \
  -d '{"source":"NDLS","destination":"LKO","date":"2025-12-15"}'

# Test seats endpoint
curl -X GET "http://localhost:5000/api/trains/102/seats?date=2025-12-15&class_type=2A" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test payment
curl -X POST http://localhost:5000/api/bookings/123/payment \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":1750,"payment_method":"razorpay"}'
```
