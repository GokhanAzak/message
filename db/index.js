const { Pool } = require('pg');
require('dotenv').config();

const db = require('./db');


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log('📦 PostgreSQL bağlantısı başarılı.'))
  .catch((err) => console.error('❌ PostgreSQL bağlantı hatası:', err));

module.exports = pool;
