import "dotenv/config";
import { db } from "./mysql/mysql2";
import { posts, users } from "./mysql/schema";
import { eq, sql } from "drizzle-orm";

async function main() {
	// Write your code here
	const query1 = db
		.select({ id: users.id, name: users.name })
		.from(users)
		.where(eq(users.id, 1));
	// .leftJoin(posts, eq(users.id, posts.authorId));
	const query2 = db
		.select({ id: users.id, name: sql<string>`users.name` })
		.from(users)
		.where(eq(users.id, 2));
	const query3 = db.select().from(users).where(eq(users.id, 3));
	const query4 = db
		.select()
		.from(users)
		.where(eq(users.id, 4))
		.leftJoin(posts, eq(users.id, posts.authorId));
	const query5 = db
		.select({ id: users.id, name: users.name, managerId: users.managerId })
		.from(users)
		.where(eq(users.id, 5));

	const res = await query1.union(query3);

	console.log(res);
}

main()
	.then(() => {
		process.exit(0);
	})
	.catch(console.error);
