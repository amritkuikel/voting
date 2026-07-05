import { n as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Uj3ZOsqR.mjs";
import { t as getClient } from "./db-Cttjio9k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/neon-BPshejci.js
var getTodos_createServerFn_handler = createServerRpc({
	id: "85b0d44a6422bfb581c68cbd937ec4a5d806bd2733763a669fcaafea7aa16ba3",
	name: "getTodos",
	filename: "src/routes/demo/neon.tsx"
}, (opts) => getTodos.__executeServer(opts));
var getTodos = createServerFn({ method: "GET" }).handler(getTodos_createServerFn_handler, async () => {
	const client = await getClient();
	if (!client) return;
	return await client.query(`SELECT * FROM todos`);
});
var insertTodo_createServerFn_handler = createServerRpc({
	id: "d7a996e2c87c9bc0170c60692ed7406e033befec83524187731c3ce6e8597e17",
	name: "insertTodo",
	filename: "src/routes/demo/neon.tsx"
}, (opts) => insertTodo.__executeServer(opts));
var insertTodo = createServerFn({ method: "POST" }).inputValidator((d) => d).handler(insertTodo_createServerFn_handler, async ({ data }) => {
	const client = await getClient();
	if (!client) return;
	await client.query(`INSERT INTO todos (title) VALUES ($1)`, [data.title]);
});
//#endregion
export { getTodos_createServerFn_handler, insertTodo_createServerFn_handler };
