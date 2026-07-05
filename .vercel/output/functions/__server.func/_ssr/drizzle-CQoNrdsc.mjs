import { c as createFileRoute, s as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BQc6Kq9y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/drizzle-CQoNrdsc.js
var $$splitComponentImporter = () => import("./drizzle-SCHCVQn_.mjs");
var getTodos = createServerFn({ method: "GET" }).handler(createSsrRpc("ba75057a8889c88398d2de85edf2b7d9f4f7cdcb8883e40dc15b78ba487d7c45"));
var Route = createFileRoute("/demo/drizzle")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	loader: async () => await getTodos()
});
//#endregion
export { Route as t };
