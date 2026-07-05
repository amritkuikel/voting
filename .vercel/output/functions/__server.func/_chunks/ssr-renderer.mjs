import { i as toRequest, n as HTTPError } from "../_libs/h3+rou3+srvx.mjs";
//#region node_modules/.pnpm/nitro-nightly@3.0.260603-be_1a8b6c6e5010bb2b1b66a9e11e632a5a/node_modules/nitro-nightly/dist/runtime/vite.mjs
function fetchViteEnv(viteEnvName, input, init) {
	const viteEnv = (globalThis.__nitro_vite_envs__ || {})[viteEnvName];
	if (!viteEnv) throw HTTPError.status(404);
	return Promise.resolve(viteEnv.fetch(toRequest(input, init)));
}
//#endregion
//#region node_modules/.pnpm/nitro-nightly@3.0.260603-be_1a8b6c6e5010bb2b1b66a9e11e632a5a/node_modules/nitro-nightly/dist/runtime/internal/vite/ssr-renderer.mjs
/** @param {{ req: Request }} HTTPEvent */
function ssrRenderer({ req }) {
	return fetchViteEnv("ssr", req);
}
//#endregion
export { ssrRenderer as default };
