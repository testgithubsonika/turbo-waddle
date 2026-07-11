/**
 * Seed All Script
 * Runs all seeders in the correct order with proper error handling
 */

const { execSync } = require('child_process');
const path = require('path');

const seeders = [
  '20251029070915-stations.js',
  '20251029071221-routes.js',
  '20251029071307-trains.js',
  '20251029071426-seats.js',
  '20251029194240-train_schedules.js',
  '20251225091802-routeStation.js',
];

console.log('🚀 Starting database seeding process...\n');

let successCount = 0;
let failCount = 0;

for (const seeder of seeders) {
  try {
    console.log(`📦 Running seeder: ${seeder}`);
    execSync(`npx sequelize-cli db:seed --seed ${seeder}`, {
      cwd: __dirname,
      stdio: 'inherit'
    });
    successCount++;
    console.log(`✅ ${seeder} completed successfully\n`);
  } catch (error) {
    failCount++;
    console.error(`❌ ${seeder} failed\n`);
    // Continue with next seeder instead of stopping
  }
}

console.log('\n' + '='.repeat(50));
console.log('📊 Seeding Summary:');
console.log(`✅ Successful: ${successCount}/${seeders.length}`);
console.log(`❌ Failed: ${failCount}/${seeders.length}`);
console.log('='.repeat(50) + '\n');

if (failCount === 0) {
  console.log('🎉 All seeders completed successfully!');
  process.exit(0);
} else {
  console.log('⚠️ Some seeders failed. Please check the errors above.');
  process.exit(1);
}
