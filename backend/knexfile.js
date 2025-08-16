import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, 'data', 'dev.sqlite3')
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'seeds')
    }
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, 'data', 'test.sqlite3')
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'seeds')
    }
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, 'data', 'production.sqlite3')
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'seeds')
    }
  }
};
