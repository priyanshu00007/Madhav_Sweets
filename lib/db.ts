import mysql from 'mysql2/promise';

const poolConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let poolPromise: Promise<mysql.Pool> | null = null;

async function getPool(): Promise<mysql.Pool> {
  if (poolPromise) return poolPromise;

  poolPromise = (async () => {
    try {
      // Step 1: Connect to server without database to ensure DB exists
      const connection = await mysql.createConnection(poolConfig);
      const dbName = process.env.DB_NAME || 'ambrosia_db';
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
      await connection.end();

      // Step 2: Create the long-lived pool
      const newPool = mysql.createPool({
        ...poolConfig,
        database: dbName,
      });
      console.log(` [DB] Connected to ${dbName} successfully`);

      // Aegis Self-Healing Protocol: Ensure persistence layers are high-fidelity
      (async () => {
        try {
          console.log(' [DB] Initiating Schema Synchronization...');
          const [columns]: any = await newPool.query('SHOW COLUMNS FROM users');
          const columnNames = columns.map((c: any) => c.Field);

          if (!columnNames.includes('phone')) {
            console.log(' [DB] Re-calibrating Users table: Injecting missing columns...');
            await newPool.query(`
               ALTER TABLE users 
               ADD COLUMN phone VARCHAR(20) AFTER password_hash,
               ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL,
               ADD COLUMN reset_token_expiry TIMESTAMP DEFAULT NULL,
               ADD COLUMN is_subscribed BOOLEAN DEFAULT FALSE,
               ADD COLUMN welcome_sent BOOLEAN DEFAULT FALSE
             `);
          }

          // Ensure role ENUM is correct
          await newPool.query("ALTER TABLE users MODIFY COLUMN role ENUM('user', 'admin', 'rider') DEFAULT 'user'");

          console.log(' [DB] Schema Synchronization Successful.');
        } catch (syncErr: any) {
          console.error(' [DB_SHIELD] Schema Sync Failed:', syncErr.message);
        }
      })();

      return newPool;
    } catch (err: any) {
      poolPromise = null; // Reset on failure so we can try again
      console.error(' [DB_CRITICAL] Connection failed:', err.message);
      throw err;
    }
  })();

  return poolPromise;
}

export async function executeQuery<T>(query: string, values: any[] = []): Promise<T> {
  try {
    const activePool = await getPool();
    const [rows] = await activePool.execute(query, values);
    return rows as T;
  } catch (error: any) {
    console.error(' [DB_ERROR] Query:', query);
    console.error(' [DB_ERROR] Message:', error.message);

    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.warn(' [DB_TIP] Tables missing. Please run the SQL in db/schema.sql to initialize.');
    }

    throw error;
  }
}

// Exporting a proxy or a wrapper to avoid "used before assigned" lint issues
export default {
  execute: async (...args: any[]) => {
    const activePool = await getPool();
    return (activePool as any).execute(...args);
  }
};
