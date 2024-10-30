import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const database = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'api',
  password: process.env.DB_PASSWORD || 'mojarras123',
  database: process.env.DB_NAME || 'criadero',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default database;

