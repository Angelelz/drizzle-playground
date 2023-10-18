import "dotenv/config";
import pg from "pg";
const { Client } = pg;
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

export const client = new Client({
  connectionString: process.env.DATABASE_URL!,
});
export const db = drizzle(client, { schema, logger: true });
