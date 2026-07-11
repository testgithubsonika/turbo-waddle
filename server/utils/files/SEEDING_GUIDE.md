# Database Seeding Guide

## Overview
This guide explains how to properly seed the train booking system database.

## Prerequisites
- PostgreSQL database running
- Environment variables configured in `.env`
- Migrations already run

## Seeding Order
Seeders must be run in this exact order due to foreign key dependencies:

1. **Stations** - Base station data
2. **Routes** - Depends on stations
3. **Trains** - Depends on routes
4. **Seats** - Depends on trains
5. **Train Schedules** - Depends on trains

## Quick Start

### Option 1: Run All Seeders (Recommended)
```bash
cd server
node seed-all.js
```

### Option 2: Run Individual Seeders
```bash
cd server
npx sequelize-cli db:seed --seed 20251029070915-stations.js
npx sequelize-cli db:seed --seed 20251029071221-routes.js
npx sequelize-cli db:seed --seed 20251029071307-trains.js
npx sequelize-cli db:seed --seed 20251029071426-seats.js
npx sequelize-cli db:seed --seed 20251029194240-train_schedules.js
npx sequelize-cli db:seed --seed 20251225091802-routeStation.js
```

## Reset Database (Clean Slate)

### Undo All Seeds
```bash
cd server
npx sequelize-cli db:seed:undo:all
```

### Undo All Migrations and Re-run
```bash
cd server
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
node seed-all.js
```

## Troubleshooting

### Error: "column 'name' does not exist"
**Fixed!** The routes seeder now correctly uses `station_name` instead of `name`.

### Error: "Key (train_number) already exists"
**Fixed!** All seeders now check for existing data before inserting.

### Error: "Seats already exist"
**Fixed!** Seeders are now idempotent - safe to run multiple times.

### Server Endpoints Not Working
After seeding, verify:

1. **Check database has data:**
```sql
SELECT COUNT(*) FROM stations;
SELECT COUNT(*) FROM routes;
SELECT COUNT(*) FROM trains;
SELECT COUNT(*) FROM seats;
SELECT COUNT(*) FROM train_schedules;
```

2. **Test API endpoints:**
```bash
# Get all stations
curl http://localhost:5000/api/trains/stations \
  -H "x-access-token: YOUR_JWT_TOKEN"

# Search trains
curl -X POST http://localhost:5000/api/trains/search \
  -H "Content-Type: application/json" \
  -H "x-access-token: YOUR_JWT_TOKEN" \
  -d '{
    "source": "NDLS",
    "destination": "BCT",
    "date": "2025-02-01"
  }'
```

## Seeder Features

### Idempotency
All seeders check for existing data before inserting:
- ✅ Safe to run multiple times
- ✅ No duplicate key errors
- ✅ Skips if data already exists

### Data Validation
- Routes seeder validates minimum station count
- Seats seeder checks train count before generating
- All seeders provide clear console feedback

### Logging
Each seeder provides detailed logs:
- ✅ Success messages with counts
- ⚠️ Warning messages for skipped operations
- ❌ Error messages with details

## Data Summary

After successful seeding, you should have:
- **65+ Stations** across India
- **50 Routes** with intermediate stops
- **64 Trains** with various classes
- **7,680+ Seats** (120 seats × 64 trains)
- **100+ Train Schedules** for different days

## Common Issues

### Issue: Seeders fail with foreign key errors
**Solution:** Ensure migrations are run first and in correct order.

### Issue: Routes seeder fails
**Solution:** Ensure stations are seeded first.

### Issue: Seats seeder creates wrong count
**Solution:** The seeder now dynamically counts trains from database.

## Verification Queries

```sql
-- Check station distribution
SELECT state, COUNT(*) as station_count 
FROM stations 
GROUP BY state 
ORDER BY station_count DESC;

-- Check trains per route
SELECT r.id, COUNT(t.id) as train_count
FROM routes r
LEFT JOIN trains t ON r.id = t.route_id
GROUP BY r.id
ORDER BY train_count DESC;

-- Check seat availability
SELECT class_type, COUNT(*) as total_seats
FROM seats
GROUP BY class_type;

-- Check schedule distribution
SELECT day_of_week, COUNT(*) as schedule_count
FROM train_schedules
GROUP BY day_of_week
ORDER BY day_of_week;
```

## Next Steps

After seeding:
1. Start the server: `npm start`
2. Test authentication endpoints
3. Test train search functionality
4. Test booking flow
5. Verify email notifications (if configured)

## Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify database connection in `.env`
3. Ensure PostgreSQL is running
4. Check that all migrations completed successfully
