# Seeder Fixes Summary

## Problems Identified

### 1. Routes Seeder Error
**Error:** `ERROR: column "name" does not exist`

**Root Cause:** 
- Seeder was querying `SELECT id, name FROM stations`
- But the actual column name is `station_name`, not `name`

**Fix Applied:**
```javascript
// Before
'SELECT id, name FROM stations ORDER BY id ASC;'

// After
'SELECT id, station_name as name FROM stations ORDER BY id ASC;'
```

### 2. Trains Seeder Error
**Error:** `ERROR: Validation error - Key (train_number)=(12951) already exists`

**Root Cause:**
- Running seeder multiple times caused duplicate key violations
- No check for existing data before insertion

**Fix Applied:**
```javascript
// Added duplicate check
const existingTrains = await queryInterface.sequelize.query(
  'SELECT train_number FROM trains;',
  { type: Sequelize.QueryTypes.SELECT }
);

const existingTrainNumbers = existingTrains.map(t => t.train_number);
const newTrains = trainsData.filter(t => !existingTrainNumbers.includes(t.train_number));

if (newTrains.length > 0) {
  await queryInterface.bulkInsert('trains', newTrains, {});
}
```

### 3. Seats Seeder Error
**Error:** `ERROR: Validation error - Key (train_id, coach, seat_number)=(1, S1, S1-1) already exists`

**Root Cause:**
- Same as trains - no duplicate checking
- Hardcoded train count (49) didn't match actual database

**Fix Applied:**
```javascript
// Check if seats already exist
const existingSeats = await queryInterface.sequelize.query(
  'SELECT COUNT(*) as count FROM seats;',
  { type: Sequelize.QueryTypes.SELECT }
);

if (existingSeats[0].count > 0) {
  console.log('✅ Seats already seeded. Skipping...');
  return;
}

// Dynamic train count from database
const trainCount = await queryInterface.sequelize.query(
  'SELECT COUNT(*) as count FROM trains;',
  { type: Sequelize.QueryTypes.SELECT }
);
```

### 4. Train Schedules Seeder Error
**Error:** Similar duplicate key violations

**Fix Applied:**
```javascript
// Added existence check
const existingSchedules = await queryInterface.sequelize.query(
  'SELECT COUNT(*) as count FROM train_schedules;',
  { type: Sequelize.QueryTypes.SELECT }
);

if (existingSchedules[0].count > 0) {
  console.log('✅ Train schedules already seeded. Skipping...');
  return;
}
```

## Key Improvements

### 1. Idempotency
All seeders are now **idempotent** - safe to run multiple times:
- ✅ Check for existing data before inserting
- ✅ Skip insertion if data already exists
- ✅ No duplicate key errors

### 2. Better Error Messages
- Clear console feedback for each operation
- Success messages with counts
- Warning messages when skipping
- Helpful error context

### 3. Dynamic Data Handling
- Seats seeder now queries actual train count
- No hardcoded assumptions about data
- Adapts to database state

### 4. Proper Dependencies
- Routes seeder validates minimum station count
- Seats seeder checks for trains before generating
- Clear dependency chain maintained

## Files Modified

1. ✅ `server/seeders/20251029071221-routes.js`
   - Fixed column name from `name` to `station_name`
   - Added duplicate check

2. ✅ `server/seeders/20251029071307-trains.js`
   - Added duplicate train_number check
   - Filter existing trains before insertion

3. ✅ `server/seeders/20251029071426-seats.js`
   - Added existence check
   - Dynamic train count query
   - Better validation

4. ✅ `server/seeders/20251029194240-train_schedules.js`
   - Added existence check
   - Success logging

## New Files Created

1. ✅ `server/seed-all.js`
   - Automated script to run all seeders in order
   - Error handling and summary reporting

2. ✅ `server/test-seeders.bat`
   - Windows batch script for testing
   - Step-by-step seeder execution

3. ✅ `server/SEEDING_GUIDE.md`
   - Comprehensive documentation
   - Troubleshooting guide
   - Verification queries

## How to Use

### Quick Start (Recommended)
```bash
cd server
node seed-all.js
```

### Manual Seeding
```bash
cd server
npx sequelize-cli db:seed --seed 20251029070915-stations.js
npx sequelize-cli db:seed --seed 20251029071221-routes.js
npx sequelize-cli db:seed --seed 20251029071307-trains.js
npx sequelize-cli db:seed --seed 20251029071426-seats.js
npx sequelize-cli db:seed --seed 20251029194240-train_schedules.js
```

### Reset and Re-seed
```bash
cd server
npx sequelize-cli db:seed:undo:all
node seed-all.js
```

## Testing Verification

After seeding, verify with these queries:

```sql
-- Check all tables have data
SELECT 'stations' as table_name, COUNT(*) as count FROM stations
UNION ALL
SELECT 'routes', COUNT(*) FROM routes
UNION ALL
SELECT 'trains', COUNT(*) FROM trains
UNION ALL
SELECT 'seats', COUNT(*) FROM seats
UNION ALL
SELECT 'train_schedules', COUNT(*) FROM train_schedules;
```

Expected results:
- Stations: 65+
- Routes: 50
- Trains: 64
- Seats: 7,680+ (120 per train × 64 trains)
- Train Schedules: 100+

## API Endpoint Testing

After successful seeding, test these endpoints:

### 1. Get All Stations
```bash
curl http://localhost:5000/api/trains/stations \
  -H "x-access-token: YOUR_JWT_TOKEN"
```

### 2. Search Trains
```bash
curl -X POST http://localhost:5000/api/trains/search \
  -H "Content-Type: application/json" \
  -H "x-access-token: YOUR_JWT_TOKEN" \
  -d '{
    "source": "NDLS",
    "destination": "BCT",
    "date": "2025-02-01"
  }'
```

### 3. Check Train Availability
```bash
curl "http://localhost:5000/api/trains/availability?train_id=1&class_type=Sleeper&date=2025-02-01" \
  -H "x-access-token: YOUR_JWT_TOKEN"
```

## Common Issues Resolved

### ❌ Before Fixes
- Routes seeder failed with column name error
- Running seeders multiple times caused crashes
- Duplicate key violations everywhere
- Hardcoded values caused mismatches

### ✅ After Fixes
- All seeders run successfully
- Safe to run multiple times
- No duplicate errors
- Dynamic data handling
- Clear feedback and logging

## Next Steps

1. ✅ Run seeders using `node seed-all.js`
2. ✅ Verify data in database
3. ✅ Start the server
4. ✅ Test API endpoints
5. ✅ Test booking flow

## Support

If issues persist:
1. Check `.env` configuration
2. Verify PostgreSQL is running
3. Ensure migrations completed successfully
4. Review console logs for specific errors
5. Check `SEEDING_GUIDE.md` for detailed troubleshooting
