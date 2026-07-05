import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tanstack-query-Cn4nEfQM.js
var import_jsx_runtime = require_jsx_runtime();
function TanStackQueryDemo() {
	const { data } = useQuery({
		queryKey: ["todos"],
		queryFn: () => Promise.resolve([
			{
				id: 1,
				name: "Alice"
			},
			{
				id: 2,
				name: "Bob"
			},
			{
				id: 3,
				name: "Charlie"
			}
		]),
		initialData: []
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-white",
		style: { backgroundImage: "radial-gradient(50% 50% at 95% 5%, #f4a460 0%, #8b4513 70%, #1a0f0a 100%)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl mb-4",
				children: "TanStack Query Simple Promise Handling"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mb-4 space-y-2",
				children: data.map((todo) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "bg-white/10 border border-white/20 rounded-lg p-3 backdrop-blur-sm shadow-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg text-white",
						children: todo.name
					})
				}, todo.id))
			})]
		})
	});
}
//#endregion
export { TanStackQueryDemo as component };
