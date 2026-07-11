
first stop db server
1. Drop and recreate the database
npx sequelize-cli db:drop
npx sequelize-cli db:create

2. Run migrations again
npx sequelize-cli db:migrate

3. Re-run seeders (if any)
npx sequelize-cli db:seed:all

/////////////////////////////////
npx sequelize-cli db:migrate

Undo the last migration
npx sequelize-cli db:migrate:undo

Undo all migrations
npx sequelize-cli db:migrate:undo:all

Run a specific seeder
npx sequelize-cli db:seed --seed 20251029070915-stations.js

Run all seeders
npx sequelize-cli db:seed:all

Undo the last seeder
npx sequelize-cli db:seed:undo

Undo all seeders
npx sequelize-cli db:seed:undo:all

 Install Redis-
 sudo apt update
sudo apt install redis-server

2. Start Redis-sudo systemctl enable --now redis-server
3. Check Redis status-sudo systemctl status redis-server
4. Test Redis connection-redis-cli ping
5. Useful Redis commands

Check Redis info-redis-cli info

Monitor Redis commands in real time-redis-cli monitor

Show currently connected clients-redis-cli client list

Flush all Redis data (use carefully!)-redis-cli FLUSHALL

6. Restart Redis if needed-sudo systemctl restart redis-server



