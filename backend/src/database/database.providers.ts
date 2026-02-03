import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const PG_POOL = 'PG_POOL';

export const databaseProviders = [
  {
    provide: PG_POOL,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const pool = new Pool({
        connectionString: configService.get<string>('DATABASE_URL'),
      });
      return pool;
    },
  },
];
