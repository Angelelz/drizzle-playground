import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
	sqliteTable,
	text,
	integer,
	uniqueIndex,
	primaryKey,
	AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";

// declaring enum in database
export const countries = sqliteTable(
	"countries",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		name: text("name", { length: 256 }),
	},
	(countries) => ({
		nameIndex: uniqueIndex("name_idx").on(countries.name),
	}),
);

export type Country = InferSelectModel<typeof countries>;
export type NewCountry = InferInsertModel<typeof countries>;

export const cities = sqliteTable("cities", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name", { length: 256 }),
	countryId: integer("country_id").references(() => countries.id),
	popularity: text("popularity", ["unknown", "known", "popular"]),
});

export type City = InferSelectModel<typeof cities>;
export type NewCity = InferInsertModel<typeof cities>;

export const users = sqliteTable("users", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	managerId: integer("user_id").references((): AnySQLiteColumn => users.id),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export const users2 = sqliteTable("users2", {
	id: text("id", { length: 190 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => Math.random().toString()),
	name: text("name").notNull(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
	posts: many(posts),
	manager: one(users, { fields: [users.managerId], references: [users.id] }),
	follows: many(follows, { relationName: "follows" }),
	followers: many(follows, { relationName: "followers" }),
	usersToGroups: many(usersToGroups),
}));

export const follows = sqliteTable(
	"follows",
	{
		followerId: integer("follower_id")
			.notNull()
			.references(() => users.id),
		followeeId: integer("followee_id")
			.notNull()
			.references(() => users.id),
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

export const groups = sqliteTable("groups", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name"),
});

export type Group = InferSelectModel<typeof groups>;
export type NewGroup = InferInsertModel<typeof groups>;

export const groupsRelations = relations(groups, ({ many }) => ({
	usersToGroups: many(usersToGroups),
}));

export const usersToGroups = sqliteTable(
	"users_to_groups",
	{
		userId: integer("user_id")
			.notNull()
			.references(() => users.id),
		groupId: integer("group_id")
			.notNull()
			.references(() => groups.id),
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

export const posts = sqliteTable("posts", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	content: text("content").notNull(),
	authorId: integer("author_id").notNull(),
});

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));
