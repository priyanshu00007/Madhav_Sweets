const mysql = require('mysql2/promise');

/**
 * AMBROSIA SUPREME - PERSISTENCE SYNCHRONIZATION SCRIPT
 * Operationalized to ensure the MySQL persistence layer matches the high-fidelity application logic.
 */
async function migrate() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '', 
    database: 'ambrosia_db'
  });

  console.log('--- INITIATING AEGIS SCHEMA SYNCHRONIZATION ---');

  try {
    // 1. Synchronize Users Terminal Manifest
    const [columns] = await connection.query('SHOW COLUMNS FROM users');
    const columnNames = columns.map(c => c.Field);

    console.log('Checking terminal manifest integrity...');

    if (!columnNames.includes('phone')) {
      console.log('Protocol: Injecting [phone] sector...');
      await connection.query('ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER password_hash');
    }
    
    if (!columnNames.includes('reset_token')) {
      console.log('Protocol: Injecting [reset_token] sector...');
      await connection.query('ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL');
    }
    
    if (!columnNames.includes('reset_token_expiry')) {
      console.log('Protocol: Injecting [reset_token_expiry] sector...');
      await connection.query('ALTER TABLE users ADD COLUMN reset_token_expiry TIMESTAMP DEFAULT NULL');
    }
    
    if (!columnNames.includes('is_subscribed')) {
      console.log('Protocol: Injecting [is_subscribed] sector...');
      await connection.query('ALTER TABLE users ADD COLUMN is_subscribed BOOLEAN DEFAULT FALSE');
    }
    
    if (!columnNames.includes('welcome_sent')) {
      console.log('Protocol: Injecting [welcome_sent] sector...');
      await connection.query('ALTER TABLE users ADD COLUMN welcome_sent BOOLEAN DEFAULT FALSE');
    }

    // 2. Recalibrate Role Security Matrix
    console.log('Recalibrating Role Security Matrix (User | Admin | Rider)...');
    await connection.query("ALTER TABLE users MODIFY COLUMN role ENUM('user', 'admin', 'rider') DEFAULT 'user'");

    // 3. Establish Sentinel Notifications Hub
    console.log('Validating Sentinel Notifications Hub...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        type ENUM('info', 'warning', 'error', 'security') DEFAULT 'info',
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('--- SYNCHRONIZATION COMPLETE: Persistence manifold is now high-fidelity. ---');
  } catch (error) {
    console.error('--- CRITICAL SYSTEM FAILURE ---');
    console.error('Diagnostic Trace:', error.message);
  } finally {
    await connection.end();
    process.exit(0);
  }
}

migrate();
