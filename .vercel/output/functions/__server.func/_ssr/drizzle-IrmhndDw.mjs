import { v as string } from "../_libs/zod.mjs";
import { n as __exportAll } from "./chunk-B-1-B7_t.mjs";
import { n as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Uj3ZOsqR.mjs";
import { a as text, c as boolean, i as timestamp, n as desc, o as serial, r as pgTable, s as integer, t as drizzle } from "../_libs/drizzle-orm.mjs";
import { t as createEnv } from "../_libs/t3-oss__env-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/drizzle-IrmhndDw.js
var env = createEnv({
	server: {
		SERVER_URL: string().url().optional(),
		DATABASE_URL: string().min(1)
	},
	/**
	* The prefix that client-side variables must have. This is enforced both at
	* a type-level and at runtime.
	*/
	clientPrefix: "VITE_",
	client: { VITE_APP_TITLE: string().min(1).optional() },
	/**
	* What object holds the environment variables at runtime. This is usually
	* `process.env` or `import.meta.env`.
	*/
	runtimeEnv: {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_POSTGRES_CLAIM_URL": "https://neon.new/database/1f0083f9-0526-4195-af8c-2f094cf9cf4e",
		"VITE_POSTHOG_KEY": "phc_AqF5rYyEP2ZYppeMKtQ6aTSTbKohpuucAQLQBC9nwz4W",
		"VITE_SENTRY_DSN": "https://48ef848161e5423020fb549d1d42e356@o4510747126857728.ingest.us.sentry.io/4511506440323072",
		"VITE_SENTRY_ORG": "future-codes",
		"VITE_SENTRY_PROJECT": "javascript-react-pq"
	},
	/**
	* By default, this library will feed the environment variables directly to
	* the Zod validator.
	*
	* This means that if you have an empty string for a value that is supposed
	* to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
	* it as a type mismatch violation. Additionally, if you have an empty string
	* for a value that is supposed to be a string with a default value (e.g.
	* `DOMAIN=` in an ".env" file), the default value will never be applied.
	*
	* In order to solve these issues, we recommend that all new projects
	* explicitly specify this option as true.
	*/
	emptyStringAsUndefined: true
});
var schema_exports = /* @__PURE__ */ __exportAll({
	candidates: () => candidates,
	electionState: () => electionState,
	todos: () => todos,
	votes: () => votes
});
var candidates = pgTable("candidates", {
	id: serial().primaryKey(),
	name: text().notNull(),
	position: text().notNull(),
	house: text(),
	symbol: text().notNull(),
	symbolImage: text().notNull(),
	photoImage: text().notNull(),
	voteCount: integer().default(0).notNull(),
	createdAt: timestamp("created_at").defaultNow()
});
var votes = pgTable("votes", {
	id: serial().primaryKey(),
	headBoyCandidateId: integer().notNull(),
	headGirlCandidateId: integer().notNull(),
	selectedHouse: text().notNull(),
	houseCaptainCandidateId: integer().notNull(),
	votedAt: timestamp("voted_at").defaultNow()
});
var electionState = pgTable("election_state", {
	id: serial().primaryKey(),
	isActive: boolean().default(false).notNull(),
	totalVotes: integer().default(0).notNull(),
	startedAt: timestamp("started_at"),
	stoppedAt: timestamp("stopped_at"),
	updatedAt: timestamp("updated_at").defaultNow()
});
var todos = pgTable("todos", {
	id: serial().primaryKey(),
	title: text().notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow()
});
var db = drizzle(env.DATABASE_URL, { schema: schema_exports });
var getTodos_createServerFn_handler = createServerRpc({
	id: "ba75057a8889c88398d2de85edf2b7d9f4f7cdcb8883e40dc15b78ba487d7c45",
	name: "getTodos",
	filename: "src/routes/demo/drizzle.tsx"
}, (opts) => getTodos.__executeServer(opts));
var getTodos = createServerFn({ method: "GET" }).handler(getTodos_createServerFn_handler, async () => {
	return await db.query.todos.findMany({ orderBy: [desc(todos.createdAt)] });
});
var createTodo_createServerFn_handler = createServerRpc({
	id: "a536f04ea949fd90c883eb008d50891bc0fede69193e7050cdd8a85e2d205e9d",
	name: "createTodo",
	filename: "src/routes/demo/drizzle.tsx"
}, (opts) => createTodo.__executeServer(opts));
var createTodo = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createTodo_createServerFn_handler, async ({ data }) => {
	await db.insert(todos).values({ title: data.title });
	return { success: true };
});
//#endregion
export { createTodo_createServerFn_handler, getTodos_createServerFn_handler };
