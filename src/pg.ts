import "dotenv/config";
import { db } from "./pg/pg";
import { posts, users, users2 } from "./pg/schema";
import { desc, eq, sql } from "drizzle-orm";
import { intersect, intersectAll, union } from "drizzle-orm/pg-core";

const un = (
  await db.execute(
    sql`select generate_series('2023-01-01'::date, '2023-12-31'::date, '1 MONTH'::interval)::date AS date where date >= '2023-01-01' order by date desc limit 4 offset 2`,
  )
).rows;
console.log({ un });
process.exit(0);
