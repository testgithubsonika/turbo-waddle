@echo off
echo ========================================
echo Testing Database Seeders
echo ========================================
echo.

cd /d e:\train\server

echo [1/5] Testing Stations Seeder...
call npx sequelize-cli db:seed --seed 20251029070915-stations.js
if %errorlevel% neq 0 (
    echo FAILED: Stations seeder
    pause
    exit /b 1
)
echo.

echo [2/5] Testing Routes Seeder...
call npx sequelize-cli db:seed --seed 20251029071221-routes.js
if %errorlevel% neq 0 (
    echo FAILED: Routes seeder
    pause
    exit /b 1
)
echo.

echo [3/5] Testing Trains Seeder...
call npx sequelize-cli db:seed --seed 20251029071307-trains.js
if %errorlevel% neq 0 (
    echo FAILED: Trains seeder
    pause
    exit /b 1
)
echo.

echo [4/5] Testing Seats Seeder...
call npx sequelize-cli db:seed --seed 20251029071426-seats.js
if %errorlevel% neq 0 (
    echo FAILED: Seats seeder
    pause
    exit /b 1
)
echo.

echo [5/5] Testing Train Schedules Seeder...
call npx sequelize-cli db:seed --seed 20251029194240-train_schedules.js
if %errorlevel% neq 0 (
    echo FAILED: Train schedules seeder
    pause
    exit /b 1
)
echo.

echo ========================================
echo All seeders completed successfully!
echo ========================================
pause
