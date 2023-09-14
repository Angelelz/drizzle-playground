import {
	sql,
	InferInsertModel,
	InferSelectModel,
	relations,
} from "drizzle-orm";
import {
	AnyMySqlColumn,
	int,
	mysqlEnum,
	mysqlTable,
	text,
	uniqueIndex,
	varchar,
	primaryKey,
	datetime,
} from "drizzle-orm/mysql-core";

// declaring enum in database
export const countries = mysqlTable(
	"countries",
	{
		id: int("id").autoincrement().primaryKey(),
		name: varchar("name", { length: 256 }),
		createdAt: datetime("created_at", { fsp: 3 }).default(
			sql`current_timestamp(3)`,
		),
	},
	(countries) => ({
		nameIndex: uniqueIndex("name_idx").on(countries.name),
	}),
);

export type Country = InferSelectModel<typeof countries>;
export type NewCountry = InferInsertModel<typeof countries>;

export const cities = mysqlTable("cities", {
	id: int("id").autoincrement().primaryKey(),
	name: varchar("name", { length: 256 }),
	countryId: int("country_id").references(() => countries.id),
	popularity: mysqlEnum("popularity", ["unknown", "known", "popular"]),
	createdAt: datetime("created_at", { fsp: 3 }).default(
		sql`current_timestamp(3)`,
	),
});

export type City = InferSelectModel<typeof cities>;
export type NewCity = InferInsertModel<typeof cities>;

export const users = mysqlTable("users", {
	id: int("id").autoincrement().primaryKey(),
	name: text("name").notNull(),
	managerId: int("user_id").references((): AnyMySqlColumn => users.id),
	createdAt: datetime("created_at", { fsp: 3 }).default(
		sql`current_timestamp(3)`,
	),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export const users2 = mysqlTable("users2", {
	id: varchar("id", { length: 190 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => Math.random().toString()),
	name: text("name").notNull(),
	createdAt: datetime("created_at", { fsp: 3 }).default(
		sql`current_timestamp(3)`,
	),
});

export const usersRelations = relations(users, ({ many, one }) => ({
	posts: many(posts),
	manager: one(users, { fields: [users.managerId], references: [users.id] }),
	follows: many(follows, { relationName: "follows" }),
	followers: many(follows, { relationName: "followers" }),
	usersToGroups: many(usersToGroups),
}));

export const follows = mysqlTable(
	"follows",
	{
		followerId: int("follower_id")
			.notNull()
			.references(() => users.id),
		followeeId: int("followee_id")
			.notNull()
			.references(() => users.id),
		createdAt: datetime("created_at", { fsp: 3 }).default(
			sql`current_timestamp(3)`,
		),
	},
	(t) => ({
		pk: primaryKey(t.followerId, t.followeeId),
	}),
);

export type Follow = InferSelectModel<typeof follows>;
export type NewFollow = InferInsertModel<typeof follows>;

export const followsRelations = relations(follows, ({ one }) => ({
	follower: one(users, {
		fields: [follows.followerId],
		references: [users.id],
		relationName: "follows",
	}),
	followee: one(users, {
		fields: [follows.followeeId],
		references: [users.id],
		relationName: "followers",
	}),
}));

export const groups = mysqlTable("groups", {
	id: int("id").autoincrement().primaryKey(),
	name: text("name"),
	createdAt: datetime("created_at", { fsp: 3 }).default(
		sql`current_timestamp(3)`,
	),
});

export type Group = InferSelectModel<typeof groups>;
export type NewGroup = InferInsertModel<typeof groups>;

export const groupsRelations = relations(groups, ({ many }) => ({
	usersToGroups: many(usersToGroups),
}));

export const usersToGroups = mysqlTable(
	"users_to_groups",
	{
		userId: int("user_id")
			.notNull()
			.references(() => users.id),
		groupId: int("group_id")
			.notNull()
			.references(() => groups.id),
		createdAt: datetime("created_at", { fsp: 3 }).default(
			sql`current_timestamp(3)`,
		),
	},
	(t) => ({
		pk: primaryKey(t.userId, t.groupId),
	}),
);

export type UserToGroup = InferSelectModel<typeof usersToGroups>;
export type NewUserToGroup = InferInsertModel<typeof usersToGroups>;

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
	group: one(groups, {
		fields: [usersToGroups.groupId],
		references: [groups.id],
	}),
	user: one(users, {
		fields: [usersToGroups.userId],
		references: [users.id],
	}),
}));

export const posts = mysqlTable("posts", {
	id: int("id").autoincrement().primaryKey(),
	content: text("content").notNull(),
	authorId: int("author_id").notNull(),
	createdAt: datetime("created_at", { fsp: 3 }).default(
		sql`current_timestamp(3)`,
	),
});

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));
