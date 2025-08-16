import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Debug: Log environment variables for troubleshooting
console.log('🔍 Environment Variables Debug:');
console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
console.log('🔍 DB_USER:', process.env.DB_USER ? 'SET' : 'NOT SET');
console.log('🔍 DB_PASSWORD:', process.env.DB_PASSWORD ? 'SET' : 'NOT SET');
console.log('🔍 DB_NAME:', process.env.DB_NAME ? 'SET' : 'NOT SET');
console.log('🔍 DB_HOST:', process.env.DB_HOST ? 'SET' : 'NOT SET');
console.log('🔍 DB_PORT:', process.env.DB_PORT || 'NOT SET');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  development: {
    username: null,
    password: null,
    database: 'dev.sqlite3',
    host: null,
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'data', 'dev.sqlite3'),
    logging: console.log,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  },
  test: {
    username: null,
    password: null,
    database: 'test.sqlite3',
    host: null,
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'data', 'test.sqlite3'),
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  },
  production: (() => {
    // Check if DATABASE_URL is provided (Render's preferred method)
    if (process.env.DATABASE_URL) {
      console.log('🔍 Using DATABASE_URL from environment');
      return {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
        logging: false,
        define: {
          timestamps: true,
          underscored: true,
          freezeTableName: true
        },
        pool: {
          max: 10,
          min: 2,
          acquire: 30000,
          idle: 10000
        },
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      };
    }
    
    // Fall back to individual environment variables
    console.log('🔍 Using individual database environment variables');
    return {
      username: process.env.DB_USER || process.env.PGUSER,
      password: process.env.DB_PASSWORD || process.env.PGPASSWORD,
      database: process.env.DB_NAME || process.env.PGDATABASE,
      host: process.env.DB_HOST || process.env.PGHOST,
      port: process.env.DB_PORT || process.env.PGPORT || 5432,
      dialect: 'postgres',
      logging: false,
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
      },
      pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    };
  })()
};
