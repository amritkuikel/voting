import { paraglideVitePlugin } from "@inlang/paraglide-js";
import babel from "@rolldown/plugin-babel";
import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";
import neon from "./neon-vite-plugin.ts";

const config = defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	return {
		resolve: { tsconfigPaths: true },
		plugins: [
			devtools(),
			 paraglideVitePlugin({
                      project: "./project.inlang",
                     outdir: "./app/paraglide",
     outputStructure: "message-modules",
     cookieName: "PARAGLIDE_LOCALE",
     strategy: ["url", "cookie", "preferredLanguage", "baseLocale"],
      urlPatterns: [
       {
         pattern: "/:path(.*)?",
         localized: [
           ["en", "/en/:path(.*)?"],
         ],
       },
     ],
              }),
			nitro({ rollupConfig: { external: [/^@sentry\//] } }),
			neon,
			tailwindcss(),
			tanstackStart(),
			viteReact(),
			babel({ presets: [reactCompilerPreset()] }),
			sentryTanstackStart({
				org: env.VITE_SENTRY_ORG,
				project: env.VITE_SENTRY_PROJECT,
				authToken: env.VITE_SENTRY_AUTH_TOKEN,
			}),
		],
	};
});

export default config;
