import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useStore } from "../_libs/@tanstack/react-form+[...].mjs";
import { n as store, t as fullName } from "./demo-store-CwMylDJ0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-BQ0koadY.js
var import_jsx_runtime = require_jsx_runtime();
function FirstName() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type: "text",
		value: useStore(store, (state) => state.firstName),
		onChange: (e) => store.setState((state) => ({
			...state,
			firstName: e.target.value
		})),
		className: "bg-white/10 rounded-lg px-4 py-2 outline-none border border-white/20 hover:border-white/40 focus:border-white/60 transition-colors duration-200 placeholder-white/40"
	});
}
function LastName() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type: "text",
		value: useStore(store, (state) => state.lastName),
		onChange: (e) => store.setState((state) => ({
			...state,
			lastName: e.target.value
		})),
		className: "bg-white/10 rounded-lg px-4 py-2 outline-none border border-white/20 hover:border-white/40 focus:border-white/60 transition-colors duration-200 placeholder-white/40"
	});
}
function FullName() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white/10 rounded-lg px-4 py-2 outline-none ",
		children: useStore(fullName, (state) => state)
	});
}
function DemoStore() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-[calc(100vh-32px)] text-white p-8 flex items-center justify-center w-full h-full",
		style: { backgroundImage: "radial-gradient(50% 50% at 80% 80%, #f4a460 0%, #8b4513 70%, #1a0f0a 100%)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-lg flex flex-col gap-4 text-3xl min-w-1/2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl font-bold mb-5",
					children: "Store Example"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FirstName, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LastName, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullName, {})
			]
		})
	});
}
//#endregion
export { DemoStore as component };
