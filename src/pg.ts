import "dotenv/config";
import { db } from "./pg/pg";
import { users, users2 } from "./pg/schema";
import { desc, eq } from "drizzle-orm";
import { intersectAll, union } from "drizzle-orm/pg-core";

async function main() {
	// Write your code here
	const testQuery = db
		.select({ id: users.id, name: users.name })
		.from(users)
		.orderBy(desc(users.id))
		.limit(5)
		.union(
			db
				.select({ id: users.id, name: users.name })
				.from(users)
				.where(eq(users.id, 1)),
		);

	const res = await testQuery;

	const res2 = await union(
		db
			.select({ id: users.id, name: users.name })
			.from(users)
			.orderBy(desc(users.id))
			.limit(5),
		db
			.select({ id: users.id, name: users.name })
			.from(users)
			.where(eq(users.id, 1)),
	)
		.orderBy(desc(users.id))
		.limit(3);
	const q3 = await db
		.insert(users)
		.values({
			id: 1,
			name: "Angelito",
		})
		.onConflictDoUpdate({
			set: { name: "Angelelz" },
			target: users.id,
		})
		.returning();

	const res3 = await db
		.insert(users2)
		.values({ name: "Angelito" })
		.returning();

	const yo = await db.select().from(users);

	const several = await db
		.insert(users)
		.values([
			{ name: "Angelito2", id: 1 },
			{ name: "second", id: 2 },
		])
		.onConflictDoUpdate({ target: users.id, set: { id: 1, name: "t" } })
		.returning()
		.toSQL();

	console.log({ res, res2, q3, yo, res3, several });
}

main()
	.then(() => {
		process.exit(0);
	})
	.catch(console.error);
