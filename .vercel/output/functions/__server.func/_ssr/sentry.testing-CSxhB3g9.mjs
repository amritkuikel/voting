import { n as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Uj3ZOsqR.mjs";
import * as fs from "node:fs/promises";
//#region node_modules/.nitro/vite/services/ssr/assets/sentry.testing-CSxhB3g9.js
/**
* FILE OVERVIEW:
* Purpose: Interactive demo page showcasing Sentry's monitoring capabilities
* Key Concepts: Error tracking, Performance monitoring, Session replay
* Module Type: Route Component
* @ai_context: Demonstrates Sentry features through interactive examples with educational context
*/
var Sentry = {
	init: () => {},
	captureException: () => {},
	setContext: () => {},
	startSpan: async (_name, callback) => {
		if (typeof callback === "function") return await callback();
		return callback;
	}
};
var badServerFunc_createServerFn_handler = createServerRpc({
	id: "69a1ebb44a4864c8e014edade928a6fd64c1e7ea75555eedee3d2822753c4604",
	name: "badServerFunc",
	filename: "src/routes/demo/sentry.testing.tsx"
}, (opts) => badServerFunc.__executeServer(opts));
var badServerFunc = createServerFn({ method: "GET" }).handler(badServerFunc_createServerFn_handler, async () => {
	return await Sentry.startSpan({
		name: "Reading non-existent file",
		op: "file.read"
	}, async () => {
		try {
			await fs.readFile("./doesnt-exist", "utf-8");
			return true;
		} catch (error) {
			Sentry.captureException(error);
			throw error;
		}
	});
});
var goodServerFunc_createServerFn_handler = createServerRpc({
	id: "3ea2c1f76fa19eeff9d5b58b1b5039f2654803b5f5c1c5a057db2e1a206413b2",
	name: "goodServerFunc",
	filename: "src/routes/demo/sentry.testing.tsx"
}, (opts) => goodServerFunc.__executeServer(opts));
var goodServerFunc = createServerFn({ method: "GET" }).handler(goodServerFunc_createServerFn_handler, async () => {
	return await Sentry.startSpan({
		name: "Successful server operation",
		op: "demo.success"
	}, async () => {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return { success: true };
	});
});
//#endregion
export { badServerFunc_createServerFn_handler, goodServerFunc_createServerFn_handler };
