import { DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

const ormconfig: DataSourceOptions = {
  type: "postgres",
  host: process.env.CHARACTERS_DB_HOST || "localhost",
  port: parseInt(process.env.CHARACTERS_DB_PORT || "5432"),
  username: process.env.CHARACTERS_DB_USER || "postgres",
  password: process.env.CHARACTERS_DB_PASSWORD || "postgres",
  database: process.env.CHARACTERS_DB_NAME || "dungeonland_characters",
  ssl: process.env.DATABASE_SSL === "true",
  synchronize: true, // Set to false in production
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
};

export default ormconfig;
