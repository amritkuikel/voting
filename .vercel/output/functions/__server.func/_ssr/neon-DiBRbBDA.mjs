import { c as createFileRoute, s as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BQc6Kq9y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/neon-DiBRbBDA.js
var $$splitComponentImporter = () => import("./neon-CNrPrkdU2.mjs");
var getTodos = createServerFn({ method: "GET" }).handler(createSsrRpc("85b0d44a6422bfb581c68cbd937ec4a5d806bd2733763a669fcaafea7aa16ba3"));
var Route = createFileRoute("/demo/neon")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	loader: async () => {
		return { todos: await getTodos() };
	}
});
//#endregion
export { Route as t };
