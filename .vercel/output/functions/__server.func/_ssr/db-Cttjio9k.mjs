import { t as cs } from "../_libs/neondatabase__serverless.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/db-Cttjio9k.js
var client;
async function getClient() {
	if (!process.env.DATABASE_URL) return;
	if (!client) client = await cs(process.env.DATABASE_URL);
	return client;
}
//#endregion
export { getClient as t };
