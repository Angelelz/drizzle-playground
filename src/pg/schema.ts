import {
	relations,
	sql,
	InferInsertModel,
	InferSelectModel,
} from "drizzle-orm";
import {
	integer,
	primaryKey,
	pgEnum,
	pgTable,
	serial,
	text,
	uniqueIndex,
	varchar,
	timestamp,
	AnyPgColumn,
} from "drizzle-orm/pg-core";

export const counters = pgTable("counters", {
	id: serial("id").unique().primaryKey(),
	count: integer("count").notNull(),
});

export const countries = pgTable(
	"countries",
	{
		id: serial("id").unique().primaryKey(),
		name: varchar("name", { length: 256 }),
		createdAt: timestamp("created_at", { precision: 3 }).default(
			sql`current_timestamp(3)`,
		),
	},
	(countries) => ({
		nameIndex: uniqueIndex("name_idx").on(countries.name),
	}),
);

export type Country = InferSelectModel<typeof countries>;
export type NewCountry = InferInsertModel<typeof countries>;

export const popularity = pgEnum("popularity", ["unknown", "known", "popular"]);
export const cities = pgTable("cities", {
	id: serial("id").unique().primaryKey(),
	name: varchar("name", { length: 256 }),
	countryId: integer("country_id").references(() => countries.id),
	popularity: popularity("popularity"),
	createdAt: timestamp("created_at", { precision: 3 }).default(
		sql`current_timestamp(3)`,
	),
});

export type City = InferSelectModel<typeof cities>;
export type NewCity = InferInsertModel<typeof cities>;

export const users = pgTable("users", {
	id: serial("id").unique().primaryKey(),
	name: text("name").notNull(),
	managerId: integer("user_id").references((): AnyPgColumn => users.id),
	createdAt: timestamp("created_at", { precision: 3 }).default(
		sql`current_timestamp(3)`,
	),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export const users2 = pgTable("users2", {
	id: varchar("id", { length: 190 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => Math.random().toString()),
	name: text("name").notNull(),
	createdAt: timestamp("created_at", { precision: 3 }).default(
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

export const follows = pgTable(
	"follows",
	{
		followerId: integer("follower_id")
			.notNull()
			.references(() => users.id),
		followeeId: integer("followee_id")
			.notNull()
			.references(() => users.id),
		createdAt: timestamp("created_at", { precision: 3 }).default(
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

export const groups = pgTable("groups", {
	id: serial("id").unique().primaryKey(),
	name: text("name"),
	createdAt: timestamp("created_at", { precision: 3 }).default(
		sql`current_timestamp(3)`,
	),
});

export type Group = InferSelectModel<typeof groups>;
export type NewGroup = InferInsertModel<typeof groups>;

export const groupsRelations = relations(groups, ({ many }) => ({
	usersToGroups: many(usersToGroups),
}));

export const usersToGroups = pgTable(
	"users_to_groups",
	{
		userId: integer("user_id")
			.notNull()
			.references(() => users.id),
		groupId: integer("group_id")
			.notNull()
			.references(() => groups.id),
		createdAt: timestamp("created_at", { precision: 3 }).default(
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

export const posts = pgTable("posts", {
	id: serial("id").unique().primaryKey(),
	content: text("content").notNull(),
	authorId: integer("author_id").notNull(),
	createdAt: timestamp("created_at", { precision: 3 }).default(
		sql`current_timestamp(3)`,
	),
});

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));
