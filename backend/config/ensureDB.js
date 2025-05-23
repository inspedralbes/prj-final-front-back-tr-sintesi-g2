// config/ensureDB.js
const mysql = require('mysql2/promise');
require('dotenv').config({ path: './environment/.env' });

async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
  await connection.end();
}

module.exports = ensureDatabaseExists;
