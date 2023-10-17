import "dotenv/config";
import { db } from "./sqlite/bun-sqlite";
import { posts, users } from "./sqlite/schema";
import { desc, eq, sql } from "drizzle-orm";
import { intersect, union } from "drizzle-orm/sqlite-core";

const query1 = db
	.select({ name: users.name, id: users.id })
	.from(users)
	.where(eq(users.id, 1))
	.leftJoin(posts, eq(users.id, posts.authorId));

const query2 = db
	.select({ id: users.id, name: sql<string>`users.name` })
	.from(users)
	.where(eq(users.id, 2));

const query3 = db
	.select({ id: users.id, name: users.name })
	.from(users)
	.where(eq(users.id, 3));

const query4 = db
	.select({ id: users.id, name: sql<string>`users.name` })
	.from(users)
	.where(eq(users.id, 4))
	.leftJoin(posts, eq(users.id, posts.authorId));

const query5 = db
	.select({ id: users.id, name: users.name })
	.from(users)
	.where(eq(users.id, 5));

const query6 = db
	.select({ id: users.id, name: users.name })
	.from(users)
	.where(eq(users.id, 2));

const result = await db
	.select()
	.from(users)
	.unionAll(db.select().from(users))
	.orderBy(desc(users.id));

const result1 = await union(
	query1,
	query2,
	intersect(query3, query4, query5),
	query6,
).orderBy(desc(users.id));

const result2 = await union(
	union(union(query1, query2), intersect(intersect(query3, query4), query5)),
	query6,
);

const result3 = await query1
	.union(query2)
	.union(query3.intersect(query4).intersect(query5))
	.union(query6);

const result4 = await query1
	.union(query2)
	.union(({ intersect }) => intersect(query3, query4, query5))
	.union(query6);

console.log({
	result,
	res1: result1,
	res2: result2,
	res3: result3,
	res4: result4,
});

// main()
//   .then(() => {
//     process.exit(0);
//   })
//   .catch(console.error);
