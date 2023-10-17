import { and, eq, isNull, lt, sql } from "drizzle-orm";
import { db } from "./mysql/mysql2";
import { users } from "./mysql/schema";
import { printQueryAsTable } from "./utils";

const employeePath = db.$with("employeePath").as(
  db
    .select({
      id: users.id,
      name: users.name,
      path: sql<string>`cast(${users.id} as char(60))`.as("path"),
    })
    .from(users)
    .where(isNull(users.managerId))
    .union((_, empPath) =>
      db
        .select({
          id: users.id,
          name: users.name,
          path: sql<string>`concat_ws(' -> ', ${empPath.path}, ${users.id})`,
        })
        .from(empPath.as("recursive"))
        .innerJoin(users, eq(empPath.id, users.managerId)),
    ),
);

const res = await db
  .withRecursive(employeePath)
  .select()
  .from(employeePath)
  .orderBy(employeePath.id);

const fibonacci = db.$with("fibonacci").as((qb) =>
  qb
    .select({
      n: sql<number>`1`.as("n"),
      fibN: sql<number>`0`.as("fibN"),
      nextFibN: sql<number>`1`.as("nextFibN"),
      gRatio: sql<number>`cast(0 as decimal(10,9))`.as("gRatio"),
      some: sql<string>`"Angel"`.as("some"),
    })
    .unionAll((_, recTable) =>
      qb
        .select({
          n: sql<number>`${recTable.n} + 1`,
          fibN: recTable.nextFibN,
          nextFibN: sql<number>`${recTable.fibN} + ${recTable.nextFibN}`,
          gRatio: sql<number>`case when ${recTable.fibN} = 0 then 0 else ${recTable.nextFibN} / ${recTable.fibN} end`,
          some: recTable.some,
        })
        .from(recTable)
        .where(and(lt(recTable.n, 20))),
    ),
);

const res1 = await db.withRecursive(fibonacci).select().from(fibonacci);

const datesSQ = db.$with("dates").as(
  db
    .select({
      date: sql`"2020-01-03"`.mapWith((val) => new Date(val)).as("date"),
    })
    .unionAll((_, dates) =>
      db
        .select({
          date: sql<Date>`${dates.date} + interval 1 day`,
        })
        .from(dates.as("recDates"))
        .where(lt(dates.date, "2020-01-14")),
    ),
);

const res2 = await db
  .withRecursive(datesSQ)
  .select({ date: datesSQ.date })
  .from(datesSQ);

const sum = db.$with("sums").as(
  db.select({ value: sql`1`.as("value") }).unionAll((_, sums) =>
    db
      .select({ value: sql`${sums.value} + 1` })
      .from(sums.as("recSums"))
      .where(lt(sums.value, 100)),
  ),
);

const res3 = await db
  .withRecursive(sum)
  .select({ sum: sql`sum(${sum.value})`.mapWith(Number) })
  .from(sum);

const tests = await db
  .select({
    date: sql`"2020-01-03"`.mapWith((val) => new Date(val)).as("date"),
  })
  .limit(1);

printQueryAsTable(res);
printQueryAsTable(res1);
printQueryAsTable(res2);
printQueryAsTable(res3);
printQueryAsTable(tests);

process.exit(0);
