import { PgColumn, PgDatabase, PgTableWithColumns } from "drizzle-orm/pg-core";
import { db } from "./pg/pg";
import * as schema from "./pg/schema";
import {
	BuildQueryResult,
	ExtractTablesWithRelations,
	Many,
	One,
	Relations,
	eq,
} from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";

// type DB = typeof db;
//
// type Schema = typeof schema;

type Schema<TTableNames extends string, TRelationNames extends string> = Record<
	TTableNames,
	PgTableWithColumns<{
		name: TTableNames;
		schema: undefined;
		columns: Record<string, PgColumn<any>>;
		dialect: "pg";
	}>
> &
	Record<
		TRelationNames,
		Relations<
			TTableNames,
			Record<TTableNames, Many<TTableNames> | One<TTableNames>>
		>
	>;

type DB = PgDatabase<
	NodePgQueryResultHKT,
	Schema<string, string>,
	ExtractTablesWithRelations<Schema<string, string>>
>;

type TableNames = keyof DB["query"];

type FindFirstArg<T extends TableNames> = Parameters<
	DB["query"][T]["findFirst"]
>[0];

type TablesWithRelations = ExtractTablesWithRelations<Schema<string, string>>;

type TableWithRelations<TTableName extends keyof TablesWithRelations> =
	TablesWithRelations[TTableName];

export const createModelPgFindFirstQuery = <
	TDB extends DB,
	TTableName extends TableNames,
	AM extends Record<string, any>,
	FM extends Record<string, any>,
>(
	tableRef: TTableName,
	_authzFn: (args: FindFirstArg<TTableName>, meta?: AM) => Promise<boolean>,
	_argsFilter?: (
		args: FindFirstArg<TTableName>,
		meta?: FM,
	) => FindFirstArg<TTableName>,
) => {
	return async <QueryArgs extends FindFirstArg<TTableName>>(
		dbClient: DB,
		queryArgs?: QueryArgs,
		_authzMeta?: AM,
		_filterMeta?: FM,
	): Promise<
		| BuildQueryResult<
				TablesWithRelations,
				TableWithRelations<TTableName>,
				QueryArgs extends undefined ? true : QueryArgs
		  >
		| undefined
	> => {
		// ... Apply filter
		const queryRef = dbClient.query[tableRef];
		const data = await queryRef.findFirst(queryArgs);
		// ... Authz logic
		return data as any;
	};
};

const getFirstUser = createModelPgFindFirstQuery(
	"users",
	() => new Promise((resolve) => resolve(true)),
);

const firstUser = await db.transaction(async (tx) =>
	getFirstUser(tx, {
		where: eq(schema.users.id, 1),
		columns: { name: true },
		with: { posts: true },
	}),
);

console.log(firstUser);
