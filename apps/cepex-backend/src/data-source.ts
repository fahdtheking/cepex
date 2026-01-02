import { DataSource } from 'typeorm';
import * as path from 'path';

// CEPEX canonical DataSource. Uses environment variables; defaults are for local dev only.
// IMPORTANT: synchronize must remain false in production per AGENT_CONTRACT.md.

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5434', 10),
  username: process.env.DB_USER || 'cepex_admin',
  password: process.env.DB_PASS || 'changeme',
  database: process.env.DB_NAME || 'cepex_db',
  entities: [path.join(__dirname, '/**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '/migrations/*{.ts,.js}')],
  synchronize: false,
  logging: false,
});

export default AppDataSource;
export { AppDataSource };
