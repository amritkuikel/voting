import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { f as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BQc6Kq9y.mjs";
import { t as Route } from "./drizzle-CQoNrdsc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/drizzle-SCHCVQn_.js
var import_jsx_runtime = require_jsx_runtime();
var createTodo = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("a536f04ea949fd90c883eb008d50891bc0fede69193e7050cdd8a85e2d205e9d"));
function DemoDrizzle() {
	const router = useRouter();
	const todos = Route.useLoaderData();
	const handleSubmit = async (e) => {
		e.preventDefault();
		const title = new FormData(e.target).get("title");
		if (!title) return;
		try {
			await createTodo({ data: { title } });
			router.invalidate();
			e.target.reset();
		} catch (error) {
			console.error("Failed to create todo:", error);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center min-h-screen p-4 text-white",
		style: { background: "linear-gradient(135deg, #0c1a2b 0%, #1a2332 50%, #16202e 100%)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-2xl p-8 rounded-xl shadow-2xl border border-white/10",
			style: {
				background: "linear-gradient(135deg, rgba(22, 32, 46, 0.95) 0%, rgba(12, 26, 43, 0.95) 100%)",
				backdropFilter: "blur(10px)"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-center gap-4 mb-8 p-4 rounded-lg",
					style: {
						background: "linear-gradient(90deg, rgba(93, 103, 227, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
						border: "1px solid rgba(93, 103, 227, 0.2)"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-lg blur-lg opacity-60 group-hover:opacity-100 transition duration-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/drizzle.svg",
								alt: "Drizzle Logo",
								className: "w-8 h-8 transform group-hover:scale-110 transition-transform duration-300"
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 text-transparent bg-clip-text",
						children: "Drizzle Database Demo"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold mb-4 text-indigo-200",
					children: "Todos"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-3 mb-6",
					children: [todos.map((todo) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-lg p-4 shadow-md border transition-all hover:scale-[1.02] cursor-pointer group",
						style: {
							background: "linear-gradient(135deg, rgba(93, 103, 227, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)",
							borderColor: "rgba(93, 103, 227, 0.3)"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg font-medium text-white group-hover:text-indigo-200 transition-colors",
								children: todo.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-indigo-300/70",
								children: ["#", todo.id]
							})]
						})
					}, todo.id)), todos.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-center py-8 text-indigo-300/70",
						children: "No todos yet. Create one below!"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						name: "title",
						placeholder: "Add a new todo...",
						className: "flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all text-white placeholder-indigo-300/50",
						style: {
							background: "rgba(93, 103, 227, 0.1)",
							borderColor: "rgba(93, 103, 227, 0.3)"
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "px-6 py-3 font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap",
						style: {
							background: "linear-gradient(135deg, #5d67e3 0%, #8b5cf6 100%)",
							color: "white"
						},
						children: "Add Todo"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 p-6 rounded-lg border",
					style: {
						background: "rgba(93, 103, 227, 0.05)",
						borderColor: "rgba(93, 103, 227, 0.2)"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-semibold mb-2 text-indigo-200",
							children: "Powered by Drizzle ORM"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-indigo-300/80 mb-4",
							children: "Next-generation ORM for Node.js & TypeScript with PostgreSQL"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-indigo-200 font-medium",
								children: "Setup Instructions:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
								className: "list-decimal list-inside space-y-2 text-indigo-300/80",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Configure your",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "px-2 py-1 rounded bg-black/30 text-purple-300",
											children: "DATABASE_URL"
										}),
										" ",
										"in .env.local"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Run:",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "px-2 py-1 rounded bg-black/30 text-purple-300",
											children: "pnpm dlx drizzle-kit generate"
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Run:",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "px-2 py-1 rounded bg-black/30 text-purple-300",
											children: "pnpm dlx drizzle-kit migrate"
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Optional:",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "px-2 py-1 rounded bg-black/30 text-purple-300",
											children: "pnpm dlx drizzle-kit studio"
										})
									] })
								]
							})]
						})
					]
				})
			]
		})
	});
}
//#endregion
export { DemoDrizzle as component };
