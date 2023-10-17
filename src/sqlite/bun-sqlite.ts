import { drizzle } from "drizzle-orm/bun-sqlite";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

import * as schema from "./schema";

const sqlite = new Database("./src/sqlite/sqlite.db");
export const db = drizzle(sqlite, { schema });
