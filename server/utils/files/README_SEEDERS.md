# 🚂 Train Booking System - Database Seeding

## 🎯 Quick Fix Summary

All seeder errors have been **FIXED**! The issues were:

1. ❌ **Routes seeder** - Wrong column name (`name` vs `station_name`)
2. ❌ **Trains seeder** - Duplicate key violations
3. ❌ **Seats seeder** - Duplicate key violations
4. ❌ **Schedules seeder** - Duplicate key violations

## ✅ What Was Fixed

### All Seeders Now:
- ✅ Check for existing data before inserting
- ✅ Safe to run multiple times (idempotent)
- ✅ Provide clear console feedback
- ✅ Handle errors gracefully
- ✅ Use correct column names

## 🚀 How to Seed Your Database

### Option 1: Automated (Recommended)
```bash
cd server
node seed-all.js
```

### Option 2: Windows Batch Script
```bash
cd server
test-seeders.bat
```

### Option 3: Manual Step-by-Step
```bash
cd server
npx sequelize-cli db:seed --seed 20251029070915-stations.js
npx sequelize-cli db:seed --seed 20251029071221-routes.js
npx sequelize-cli db:seed --seed 20251029071307-trains.js
npx sequelize-cli db:seed --seed 20251029071426-seats.js
npx sequelize-cli db:seed --seed 20251029194240-train_schedules.js
```

## 🔄 Reset Database

### Undo All Seeds
```bash
cd server
npx sequelize-cli db:seed:undo:all
```

### Complete Reset (Migrations + Seeds)
```bash
cd server
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
node seed-all.js
```

## 📊 Expected Data After Seeding

| Table | Count | Description |
|-------|-------|-------------|
| stations | 65+ | Major railway stations across India |
| routes | 50 | Train routes with stops |
| trains | 64 | Various train services |
| seats | 7,680+ | 120 seats per train × 64 trains |
| train_schedules | 100+ | Weekly schedules |

## 🧪 Verify Seeding Success

### Check Database
```sql
SELECT 'stations' as table_name, COUNT(*) FROM stations
UNION ALL SELECT 'routes', COUNT(*) FROM routes
UNION ALL SELECT 'trains', COUNT(*) FROM trains
UNION ALL SELECT 'seats', COUNT(*) FROM seats
UNION ALL SELECT 'train_schedules', COUNT(*) FROM train_schedules;
```

### Test API Endpoints

1. **Start Server**
```bash
cd server
npm start
```

2. **Test Stations Endpoint**
```bash
curl http://localhost:5000/api/trains/stations \
  -H "x-access-token: YOUR_JWT_TOKEN"
```

3. **Test Train Search**
```bash
curl -X POST http://localhost:5000/api/trains/search \
  -H "Content-Type: application/json" \
  -H "x-access-token: YOUR_JWT_TOKEN" \
  -d '{"source":"NDLS","destination":"BCT","date":"2025-02-01"}'
```

## 📚 Documentation Files

- **FIXES_SUMMARY.md** - Detailed explanation of all fixes
- **SEEDING_GUIDE.md** - Complete seeding guide with troubleshooting
- **seed-all.js** - Automated seeding script
- **test-seeders.bat** - Windows batch testing script

## 🐛 Troubleshooting

### Seeder Still Fails?

1. **Check PostgreSQL is running**
```bash
psql -U postgres -c "SELECT version();"
```

2. **Verify .env configuration**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=postgres
DB_PASSWORD=your_password
```

3. **Ensure migrations are complete**
```bash
npx sequelize-cli db:migrate:status
```

4. **Check for existing data conflicts**
```bash
npx sequelize-cli db:seed:undo:all
node seed-all.js
```

### Server Endpoints Not Working?

1. **Verify data exists in database** (see SQL query above)
2. **Check server is running** on correct port
3. **Verify JWT token** is valid and not expired
4. **Check CORS settings** if calling from frontend
5. **Review server logs** for specific errors

## 🎉 Success Indicators

You'll know seeding worked when:
- ✅ All seeders complete without errors
- ✅ Console shows success messages with counts
- ✅ Database queries return expected row counts
- ✅ API endpoints return train data
- ✅ Train search works with valid station codes

## 📞 Need Help?

1. Check **FIXES_SUMMARY.md** for detailed fix explanations
2. Review **SEEDING_GUIDE.md** for comprehensive troubleshooting
3. Verify all prerequisites are met
4. Check console logs for specific error messages

## 🔗 Related Files

- `server/seeders/` - All seeder files
- `server/migrations/` - Database schema migrations
- `server/models/` - Sequelize models
- `server/controllers/train.controller.js` - Train API logic
- `server/routes/train.routes.js` - Train API routes

---

**Last Updated:** 2025-01-29  
**Status:** ✅ All Issues Resolved
