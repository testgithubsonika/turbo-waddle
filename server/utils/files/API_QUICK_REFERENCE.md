# SEGMENT-BASED BOOKING API - QUICK REFERENCE

## 📋 API Flow Overview

```
1. Search Trains (get route info + sequences)
   ↓
2. Get Available Seats (using overlap rule)
   ↓
3. Create Booking (store SeatAllocation for segment)
   ↓
4. View Booking / Cancel / Manage
```

---

## 🔍 1. Search Trains

**Endpoint:** `POST /api/trains/search`

**Request:**
```json
{
  "source": "NDLS",
  "destination": "BCT",
  "date": "2025-12-26"
}
```

**Response:**
```json
{
  "trains": [
    {
      "train_id": 1,
      "train_name": "Rajdhani Express",
      "train_number": "12345",
      "departure_time": "14:30:00",
      "arrival_time": "22:00:00",
      "distance_km": 400,
      "base_fare_per_km": 1.25,
      "route_id": 5,
      "from_sequence": 2,
      "to_sequence": 5
    }
  ]
}
```

**Key Fields Used Later:**
- `route_id` → Required for availability check
- `from_sequence` → Source station position in route
- `to_sequence` → Destination station position in route
- `distance_km` → For fare calculation

---

## 💺 2. Get Available Seats (Optional Pre-check)

**Note:** This is optional; availability is checked during booking.

**Endpoint:** `GET /api/trains/:trainId/available-seats`

**Query Parameters:**
```
?classType=3A
&date=2025-12-26
&routeId=5
&fromSequence=2
&toSequence=5
```

**Response:**
```json
{
  "available_seats": [
    {
      "id": 42,
      "seat_number": "A1",
      "coach": "A",
      "class_type": "3A"
    },
    {
      "id": 43,
      "seat_number": "A2",
      "coach": "A",
      "class_type": "3A"
    }
  ],
  "total": 15
}
```

---

## ✅ 3. Create Booking

**Endpoint:** `POST /api/bookings`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "train_id": 1,
  "route_id": 5,
  "class_type": "3A",
  "journey_date": "2025-12-26",
  "distance_km": 400,
  "from_sequence": 2,
  "to_sequence": 5,
  "passengers": [
    {
      "name": "Alice Johnson",
      "age": 30,
      "gender": "F"
    },
    {
      "name": "Bob Smith",
      "age": 28,
      "gender": "M"
    }
  ]
}
```

**Response - Success (Seats Available):**
```json
{
  "message": "Booking confirmed",
  "booking_id": 101,
  "pnr": "PNR123456",
  "status": "confirmed",
  "total_fare": 1000,
  "tickets": [
    {
      "ticket_id": 201,
      "passenger_name": "Alice Johnson",
      "seat_number": "A1",
      "coach": "A",
      "status": "CONFIRMED",
      "seat_allocation": {
        "journey_date": "2025-12-26",
        "route_id": 5,
        "from_sequence": 2,
        "to_sequence": 5
      }
    },
    {
      "ticket_id": 202,
      "passenger_name": "Bob Smith",
      "seat_number": "A2",
      "coach": "A",
      "status": "CONFIRMED",
      "seat_allocation": {
        "journey_date": "2025-12-26",
        "route_id": 5,
        "from_sequence": 2,
        "to_sequence": 5
      }
    }
  ]
}
```

**Response - Waitlist (No Seats Available):**
```json
{
  "message": "Added to waitlist",
  "booking_id": 102,
  "pnr": "PNR123457",
  "status": "waitlisted",
  "total_fare": 1000,
  "tickets": [
    {
      "ticket_id": 203,
      "passenger_name": "Charlie Brown",
      "status": "WAITLIST",
      "waitlist_no": 5
    }
  ]
}
```

### ⚠️ Request Validation

**Required Fields:**
- `train_id` (number)
- `route_id` (number) ← From search result
- `class_type` (string) - "Sleeper", "3A", "2A", "CC"
- `journey_date` (string) - Format: YYYY-MM-DD
- `distance_km` (number)
- `from_sequence` (number) ← From search result
- `to_sequence` (number) ← From search result
- `passengers` (array)
  - Each passenger must have: `name`, `age`, `gender`

**Error Responses:**
```json
{
  "message": "Missing required fields: ..."
}
```

---

## 📖 4. Get Booking History

**Endpoint:** `GET /api/bookings`

**Query Parameters (Optional):**
```
?page=1
&limit=10
&status=confirmed
&start_date=2025-12-01
&end_date=2025-12-31
```

**Response:**
```json
{
  "user_id": 5,
  "pagination": {
    "total_records": 3,
    "current_page": 1,
    "total_pages": 1,
    "records_per_page": 10
  },
  "bookings": [
    {
      "booking_id": 101,
      "pnr": "PNR123456",
      "journey_date": "2025-12-26",
      "total_fare": 1000,
      "status": "confirmed",
      "tickets": [
        {
          "ticket_id": 201,
          "passenger_name": "Alice Johnson",
          "passenger_age": 30,
          "passenger_gender": "F",
          "seat_number": "A1",
          "coach": "A",
          "class_type": "3A",
          "train_name": "Rajdhani Express",
          "train_number": "12345"
        }
      ],
      "cancellation": null
    }
  ]
}
```

---

## ❌ 5. Cancel Booking

**Endpoint:** `DELETE /api/bookings/:bookingId`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "message": "Booking cancelled successfully",
  "booking_id": 101,
  "refund_amount": 800,
  "refund_rate": 0.8,
  "promoted_count": 1
}
```

### Refund Policy:
- **Standard:** 80% (7+ days before)
- **Late:** 50% (24 hours before)
- **Very Late:** 25% (6 hours before)
- **Cannot cancel:** Past journey

### On Cancellation:
1. ✅ Booking status → 'cancelled'
2. ✅ All tickets → 'CANCELLED'
3. ✅ SeatAllocations → Deleted (frees up seats)
4. ✅ Waitlist → Auto-promoted (if any match)
5. ✅ Refund recorded in Cancellation table

---

## 🚀 Example Workflow

### Full Booking Journey

**Step 1: Search**
```bash
curl -X POST http://localhost:3000/api/trains/search \
  -H "Content-Type: application/json" \
  -d '{
    "source": "NDLS",
    "destination": "BCT",
    "date": "2025-12-26"
  }'
```

**Step 2: Book**
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "train_id": 1,
    "route_id": 5,
    "class_type": "3A",
    "journey_date": "2025-12-26",
    "distance_km": 400,
    "from_sequence": 2,
    "to_sequence": 5,
    "passengers": [
      {"name":"Alice","age":30,"gender":"F"}
    ]
  }'
```

**Step 3: View Booking**
```bash
curl -X GET http://localhost:3000/api/bookings \
  -H "Authorization: Bearer $TOKEN"
```

**Step 4: Cancel (if needed)**
```bash
curl -X DELETE http://localhost:3000/api/bookings/101 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔒 Important Notes

### Segment Overlap Logic

A seat is **available** for your segment IF no existing allocation overlaps:

```
Request: Sequence 2→5
Seat A allocations:
  - Allocation 1: Seq 2→4 → OVERLAP ✗ (2<5 AND 4>2)
  - Allocation 2: Seq 4→5 → NO OVERLAP ✓ (NOT: 4<5 AND 5>4)
  - Allocation 3: Seq 5→6 → NO OVERLAP ✓ (NOT: 5<5 AND 6>4)
```

### Waitlist Promotion

When a confirmed booking is cancelled:
1. Its SeatAllocations are deleted
2. First WAITLIST passenger for that segment is promoted
3. New SeatAllocation is created for them
4. If they get all segments booked → Booking status = 'confirmed'

### Transaction Safety

- All operations use SERIALIZABLE isolation level
- Row-level locking on seats and allocations
- Atomic: seat assignment + allocation creation
- No race conditions or double-booking

---

## 📊 Database Integrity

### Verify No Double Bookings
```sql
SELECT COUNT(*) as overlaps
FROM seat_allocations sa1
JOIN seat_allocations sa2 
  ON sa1.seat_id = sa2.seat_id
  AND sa1.journey_date = sa2.journey_date
  AND sa1.route_id = sa2.route_id
  AND sa1.booking_id != sa2.booking_id
WHERE sa1.from_sequence < sa2.to_sequence
  AND sa1.to_sequence > sa2.from_sequence;
-- Should return 0
```

### View All Allocations for a Train
```sql
SELECT sa.*, t.passenger_name, s.seat_number
FROM seat_allocations sa
JOIN tickets t ON sa.booking_id = t.booking_id
JOIN seats s ON sa.seat_id = s.id
WHERE sa.journey_date = '2025-12-26'
  AND s.train_id = 1
ORDER BY sa.from_sequence, s.seat_number;
```

---

## ✨ Summary

| Operation | Method | Endpoint | Requires Login |
|-----------|--------|----------|----------------|
| Search Trains | POST | `/api/trains/search` | No |
| Book Seats | POST | `/api/bookings` | Yes |
| View Bookings | GET | `/api/bookings` | Yes |
| Cancel Booking | DELETE | `/api/bookings/:id` | Yes |

This API is **100% railway-accurate** with segment-based seat allocation! 🚂
