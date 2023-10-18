import "dotenv/config";
import { db } from "./pg";
import {
  users,
  type NewUser,
  follows,
  groups,
  usersToGroups,
  posts,
} from "./schema";

async function seed() {
  const USERS: NewUser[] = [
    {
      id: 1,
      name: "Angel",
    },
    {
      id: 2,
      name: "Joe",
      managerId: 1,
    },
    {
      id: 3,
      name: "Jane",
      managerId: 1,
    },
    {
      id: 4,
      name: "John",
      managerId: 2,
    },
    {
      id: 5,
      name: "Dan",
      managerId: 1,
    },
  ];

  console.log("hello?");
  await db.delete(usersToGroups);
  console.log("deleted?");
  await db.delete(follows);
  await db.update(users).set({ managerId: null });
  await db.delete(users);
  await db.insert(users).values(USERS);

  await db.insert(follows).values([
    { followeeId: 1, followerId: 2 },
    { followeeId: 1, followerId: 3 },
    { followeeId: 1, followerId: 4 },
    { followeeId: 1, followerId: 5 },
    { followeeId: 2, followerId: 1 },
    { followeeId: 2, followerId: 5 },
  ]);

  await db.delete(groups);
  await db.insert(groups).values([
    {
      id: 1,
      name: "Group 1",
    },
    {
      id: 2,
      name: "Group 2",
    },
    {
      id: 3,
      name: "Group 3",
    },
    {
      id: 4,
      name: "Group 4",
    },
  ]);

  await db.insert(usersToGroups).values([
    { userId: 1, groupId: 1 },
    { userId: 1, groupId: 2 },
    { userId: 1, groupId: 3 },
    { userId: 1, groupId: 4 },
    { userId: 2, groupId: 1 },
    { userId: 2, groupId: 2 },
    { userId: 2, groupId: 3 },
    { userId: 2, groupId: 4 },
  ]);

  await db.delete(posts);
  await db.insert(posts).values([
    {
      authorId: 1,
      content: "Hello",
    },
    {
      authorId: 1,
      content: "World",
    },
  ]);
}

seed()
  .then(() => {
    process.exit(0);
  })
  .catch(console.error);
