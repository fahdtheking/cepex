import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersModule } from './partners/partners.module';
import { DealsModule } from './deals/deals.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5433', 10),
            username: process.env.DB_USER || 'droppay_admin',
            password: process.env.DB_PASS || 'secure_commercial_password',
            database: process.env.DB_NAME || 'droppay_os',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false, // Disabled per AGENT_CONTRACT.md
        }),
        PartnersModule,
        DealsModule,
    ],
})
export class AppModule { }
