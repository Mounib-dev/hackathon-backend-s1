import "reflect-metadata";
import { DataSource } from "typeorm";

import { User } from "./entity/User";
import { Alert } from "./entity/Alert";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Alert],
  migrations: [],
  subscribers: [],
});
