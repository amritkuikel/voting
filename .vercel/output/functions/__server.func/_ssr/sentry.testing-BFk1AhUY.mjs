import { o as __toESM } from "../_runtime.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as SentryLogo, t as Sentry } from "./sentry.testing-CF9spJ-U.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sentry.testing-BFk1AhUY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* FILE OVERVIEW:
* Purpose: Interactive demo page showcasing Sentry's monitoring capabilities
* Key Concepts: Error tracking, Performance monitoring, Session replay
* Module Type: Route Component
* @ai_context: Demonstrates Sentry features through interactive examples with educational context
*/
var SplitErrorComponent = ({ error }) => {
	(0, import_react.useEffect)(() => {
		Sentry.captureException(error);
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-[#181423]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SentryLogo, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-white mt-4 mb-2",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[#A49FB5]",
					children: error.message
				})
			]
		})
	});
};
//#endregion
export { SplitErrorComponent as errorComponent };
