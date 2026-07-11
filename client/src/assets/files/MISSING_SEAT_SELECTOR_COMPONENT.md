# Missing Component: SeatSelector

This component needs to be created in the frontend to complete the booking flow.

## File Location
`src/components/SeatSelector.jsx`

## Component Code
```jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import api from '../services/api';

const SeatSelector = ({ trainId, date, classType, onSeatSelect }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSeats();
  }, [trainId, date, classType]);

  const fetchSeats = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/trains/${trainId}/seats`, {
        params: { date, class_type: classType }
      });
      setSeats(response.data.seats);
      setError('');
    } catch (err) {
      setError('Failed to load seats');
      setSeats([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatNumber) => {
    const seat = seats.find(s => s.seat_number === seatNumber);
    if (seat.status === 'available') {
      setSelectedSeats(prev => 
        prev.includes(seatNumber)
          ? prev.filter(s => s !== seatNumber)
          : [...prev, seatNumber]
      );
    }
  };

  const handleConfirm = () => {
    onSeatSelect(selectedSeats);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="size-8 animate-spin mr-2" />
        Loading seats...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  // Group seats by coach
  const coachMap = {};
  seats.forEach(seat => {
    if (!coachMap[seat.coach]) {
      coachMap[seat.coach] = [];
    }
    coachMap[seat.coach].push(seat);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Seats</CardTitle>
      </CardHeader>
      <CardContent className="gap-section space-y-6">
        {/* Legend */}
        <div className="flex gap-6 justify-center flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 border-2 border-green-500 rounded" />
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 border-2 border-gray-500 rounded" />
            <span className="text-sm">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 border-2 border-blue-500 rounded" />
            <span className="text-sm">Selected</span>
          </div>
        </div>

        {/* Seats by Coach */}
        {Object.entries(coachMap).map(([coach, coachSeats]) => (
          <div key={coach}>
            <h3 className="font-semibold mb-3">Coach {coach}</h3>
            <div className="grid grid-cols-6 gap-3 mb-6">
              {coachSeats.map(seat => (
                <button
                  key={seat.seat_number}
                  onClick={() => handleSeatClick(seat.seat_number)}
                  disabled={seat.status === 'booked'}
                  className={`
                    w-10 h-10 rounded border-2 transition-all flex items-center justify-center text-xs font-medium
                    ${
                      selectedSeats.includes(seat.seat_number)
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : seat.status === 'available'
                        ? 'bg-green-100 border-green-500 hover:bg-green-200 cursor-pointer'
                        : 'bg-gray-300 border-gray-500 cursor-not-allowed opacity-60'
                    }
                  `}
                  title={`${seat.seat_number} - ${seat.status}`}
                >
                  {seat.seat_number.replace(/[A-Z]/, '')}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm">
            Selected: <strong>{selectedSeats.length}</strong> seat(s)
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedSeats.join(', ')}
          </p>
        </div>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm}
          disabled={selectedSeats.length === 0}
          className="w-full"
        >
          Confirm {selectedSeats.length > 0 && `(${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''})`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SeatSelector;
```

## How to Use It
```jsx
// In BookingPage.jsx
import SeatSelector from '../components/SeatSelector';

<SeatSelector 
  trainId={train.train_id}
  date={journeyDate}
  classType={selectedClass}
  onSeatSelect={(selectedSeats) => {
    console.log('Selected seats:', selectedSeats);
    // Pass to booking API
  }}
/>
```

## What This Component Does
1. ✅ Fetches available seats from backend
2. ✅ Displays seats in a grid organized by coach
3. ✅ Shows seat status (available, booked)
4. ✅ Allows selection of multiple seats
5. ✅ Shows visual feedback for selected seats
6. ✅ Passes selected seats back to parent component

## Backend Endpoint Required
```
GET /api/trains/:train_id/seats?date=2025-12-15&class_type=2A

Response:
{
  "train_id": 102,
  "date": "2025-12-15",
  "class_type": "2A",
  "seats": [
    {
      "seat_number": "A1",
      "coach": "A",
      "class": "2A",
      "status": "available",
      "price": 875
    },
    {
      "seat_number": "A2",
      "coach": "A",
      "class": "2A",
      "status": "booked",
      "price": 875
    }
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

## Integration with Booking Flow
```
Current Flow:
SearchResults → TrainCard → BookingPage → Confirmation

New Flow:
SearchResults → TrainCard → SeatSelector → BookingPage → Confirmation

Updated BookingPage should:
1. Show SeatSelector first
2. Get selected seats from user
3. Then show passenger details form
4. Submit booking with selected seats
```

## Styling Notes
- Uses green for available seats ✅
- Uses gray for booked seats ❌
- Uses blue for selected seats 🔵
- Responsive grid that adapts to screen size
- Matches existing UI theme with proper spacing

---

## Status
- **Component:** Ready to implement
- **Backend Endpoint:** Still needs to be created
- **Frontend Integration:** Can be added immediately
- **Expected Time:** 1-2 hours to fully implement

This is the key missing piece for a complete booking experience!
