const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '3306', 10),
};

let pool = null;

async function initDB() {
  const dbName = process.env.DB_NAME || 'urban_harvest_hub';
  let connection;
  try {
    // 1. Connect without database to create it if it doesn't exist
    connection = await mysql.createConnection(dbConfig);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database '${dbName}' verified/created.`);
  } catch (err) {
    console.error('Failed to connect to MySQL to verify database. Make sure XAMPP MySQL is running.', err);
    throw err;
  } finally {
    if (connection) {
      await connection.end();
    }
  }

  // 2. Create pool with the database
  pool = mysql.createPool({
    ...dbConfig,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    // 3. Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        passwordHash VARCHAR(255) NOT NULL,
        role ENUM('member', 'admin') DEFAULT 'member',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category ENUM('food', 'lifestyle', 'education') NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        image VARCHAR(500) NOT NULL,
        availability INT DEFAULT 1,
        location VARCHAR(255) NOT NULL,
        date DATE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NULL,
        itemId INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        quantity INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (itemId) REFERENCES items(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        itemId INT NOT NULL,
        rating INT NOT NULL,
        comment TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (itemId) REFERENCES items(id) ON DELETE CASCADE,
        CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 5)
      ) ENGINE=InnoDB;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        frequency ENUM('weekly', 'monthly', 'biweekly') NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subscription TEXT NOT NULL,
        endpoint VARCHAR(500) UNIQUE NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    console.log('Database tables initialized successfully.');
  } catch (err) {
    console.error('Error creating database tables:', err);
    throw err;
  }
}

async function query(sql, params) {
  if (!pool) {
    throw new Error('Database pool has not been initialized. Call initDB() first.');
  }
  const [results] = await pool.execute(sql, params);
  return results;
}

module.exports = {
  initDB,
  query,
  getPool: () => pool
};
