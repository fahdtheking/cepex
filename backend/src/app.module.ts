import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AiModule } from './ai/ai.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { NegotiationsModule } from './negotiations/negotiations.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ProductsServicesModule } from './products-services/products-services.module';
import { SearchModule } from './search/search.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuditModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    ProductsServicesModule,
    NegotiationsModule,
    AiModule,
    SearchModule,
    ApprovalsModule,
    AdminModule,
  ],
})
export class AppModule {}
