import "reflect-metadata";
import { DataSource } from "typeorm";

import { User } from "./entity/User";
import { Alert } from "./entity/Alert";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "mnbmoon345",
  database: "echolink",
  synchronize: true,
  logging: false,
  entities: [User, Alert],
  migrations: [],
  subscribers: [],
});
