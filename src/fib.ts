import { sql } from "drizzle-orm";
import { db } from "./mysql/mysql2";

const fibonacci = db.$with("fibonacci").as((qb) =>
	qb
		.select({
			n: sql`1`.mapWith(String).as("n"),
			fibN: sql`0`.mapWith(String).as("fibN"),
			nextFibN: sql`1`.mapWith(String).as("nextFibN"),
		})
		.unionAll(
			qb
				.select({
					n: sql<string>`n + 1`,
					fibN: sql<string>`nextFibN`,
					nextFibN: sql<string>`fibN + nextFibN`,
				})
				.from(sql`fibonacci`)
				.where(sql`n < 10`),
		),
);

const res = await db.withRecursive(fibonacci).select().from(fibonacci);

console.log("\n------------------------");
console.log("| n  | fibN | nextFibN |");
console.log("|----|------|----------|");
res.forEach((row) => {
	console.log(
		"|",
		row.n.padEnd(2),
		"|",
		row.fibN.padEnd(4),
		"|",
		row.nextFibN.padEnd(8),
		"|",
	);
});
console.log("------------------------");

process.exit(0);
