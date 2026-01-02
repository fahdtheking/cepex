import "reflect-metadata";
import { DataSource } from "typeorm";
import * as path from "path";

const baseDir = path.resolve(process.cwd(), "apps/droppay-backend/src");

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.TYPEORM_HOST || "localhost",
  port: Number(process.env.TYPEORM_PORT) || 5433,
  username: process.env.TYPEORM_USERNAME || "droppay_admin",
  password: process.env.TYPEORM_PASSWORD || "secure_commercial_password",
  database: process.env.TYPEORM_DATABASE || "droppay_os",
  entities: [path.join(baseDir, "**/*.entity{.ts,.js}")],
  migrations: [path.join(baseDir, "migrations/*{.ts,.js}")],
  synchronize: false,
});

export default AppDataSource;
