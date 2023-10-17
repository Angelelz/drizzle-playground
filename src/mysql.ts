import { and, eq, isNull, lt, sql } from "drizzle-orm";
import { db } from "./mysql/mysql2";
import { users } from "./mysql/schema";
import { printQueryAsTable } from "./utils";

const union1 = await db
  .select()
  .from(users)
  .where(eq(users.id, 1))
  .unionAll(db.select().from(users))
  .orderBy(users.id);
console.log(union1);

process.exit(0);
