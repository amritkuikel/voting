import { o as __toESM } from "../_runtime.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BQc6Kq9y.mjs";
import { n as SentryLogo, t as Sentry } from "./sentry.testing-CF9spJ-U.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sentry.testing-wbVkWmUK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* FILE OVERVIEW:
* Purpose: Interactive demo page showcasing Sentry's monitoring capabilities
* Key Concepts: Error tracking, Performance monitoring, Session replay
* Module Type: Route Component
* @ai_context: Demonstrates Sentry features through interactive examples with educational context
*/
var badServerFunc = createServerFn({ method: "GET" }).handler(createSsrRpc("69a1ebb44a4864c8e014edade928a6fd64c1e7ea75555eedee3d2822753c4604"));
var goodServerFunc = createServerFn({ method: "GET" }).handler(createSsrRpc("3ea2c1f76fa19eeff9d5b58b1b5039f2654803b5f5c1c5a057db2e1a206413b2"));
function SentryButton({ children, onClick, variant = "primary", disabled = false, loading = false }) {
	const baseColor = variant === "error" ? "#E50045" : "#553DB8";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		disabled: disabled || loading,
		className: "group w-full rounded-lg text-white cursor-pointer border-none p-0 transition-all disabled:cursor-not-allowed disabled:opacity-60",
		style: { backgroundColor: baseColor },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-lg font-semibold transition-transform group-hover:-translate-y-1 group-active:translate-y-0 group-disabled:translate-y-0",
			style: {
				backgroundColor: variant === "error" ? "#FF1A5C" : "#7553FF",
				border: `1px solid ${baseColor}`
			},
			children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				className: "animate-spin h-5 w-5",
				xmlns: "http://www.w3.org/2000/svg",
				fill: "none",
				viewBox: "0 0 24 24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					className: "opacity-25",
					cx: "12",
					cy: "12",
					r: "10",
					stroke: "currentColor",
					strokeWidth: "4"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					className: "opacity-75",
					fill: "currentColor",
					d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				})]
			}), children]
		})
	});
}
function FeatureCard({ icon, title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-[#1C1825] rounded-xl p-4 border border-[#2D2640] hover:border-[#7553FF]/50 transition-all group",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 mb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[#7553FF] group-hover:scale-110 transition-transform",
				children: icon
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-semibold text-white",
				children: title
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-[#A49FB5] pl-9",
			children: description
		})]
	});
}
function ResultBadge({ type, spanOp, onCopy }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const handleCopy = () => {
		navigator.clipboard.writeText(spanOp);
		setCopied(true);
		onCopy();
		setTimeout(() => setCopied(false), 2e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 space-y-3",
		children: [
			type === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 bg-[#E50045]/10 border border-[#E50045]/30 rounded-lg px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					className: "w-5 h-5 text-[#FF1A5C]",
					fill: "none",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					strokeWidth: "2",
					viewBox: "0 0 24 24",
					stroke: "currentColor",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: "Error captured" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[#FF1A5C] text-sm font-medium",
					children: "Error captured and sent to Sentry"
				})]
			}),
			type === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 bg-[#00F261]/10 border border-[#00BF4D]/30 rounded-lg px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					className: "w-5 h-5 text-[#00F261]",
					fill: "none",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					strokeWidth: "2",
					viewBox: "0 0 24 24",
					stroke: "currentColor",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: "Trace complete" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 13l4 4L19 7" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[#00F261] text-sm font-medium",
					children: "Trace completed successfully"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: handleCopy,
				className: "relative flex items-center gap-2 bg-[#7553FF]/10 hover:bg-[#7553FF]/20 border border-[#7553FF]/30 rounded-lg px-4 py-2 transition-all cursor-pointer w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[#B3A1FF] text-sm",
						children: "span.op:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "text-[#7553FF] font-mono text-sm",
						children: spanOp
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						className: "w-4 h-4 text-[#B3A1FF] ml-auto",
						fill: "none",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						strokeWidth: "2",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: "Copy to clipboard" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" })]
					}),
					copied && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute -top-8 left-1/2 -translate-x-1/2 bg-[#00F261] text-[#181423] text-xs font-medium px-2 py-1 rounded animate-pulse",
						children: "Copied!"
					})
				]
			})
		]
	});
}
function ProgressBar({ loading }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 flex items-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-3 h-3 rounded-full transition-all ${loading ? "bg-[#7553FF] animate-pulse" : "bg-[#00F261]"}` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 h-2 bg-[#2D2640] rounded-full overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-gradient-to-r from-[#7553FF] to-[#B3A1FF] rounded-full transition-all duration-500",
					style: { width: loading ? "60%" : "100%" }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-[#A49FB5] w-16 text-right",
				children: loading ? "Running..." : "Complete"
			})
		]
	});
}
function RouteComponent() {
	const [isLoading, setIsLoading] = (0, import_react.useState)({});
	const [results, setResults] = (0, import_react.useState)({});
	const [sentryConfigured, setSentryConfigured] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setSentryConfigured(true);
	}, []);
	const showWarning = sentryConfigured === false;
	const handleClientError = async () => {
		setIsLoading((prev) => ({
			...prev,
			clientError: true
		}));
		try {
			await Sentry.startSpan({
				name: "Client Error Flow Demo",
				op: "demo.client-error"
			}, async () => {
				Sentry.setContext("demo", {
					feature: "client-error-demo",
					triggered_at: (/* @__PURE__ */ new Date()).toISOString()
				});
				throw new Error("Client-side error demonstration");
			});
		} catch (error) {
			Sentry.captureException(error);
			setResults((prev) => ({
				...prev,
				clientError: {
					type: "error",
					spanOp: "demo.client-error"
				}
			}));
		} finally {
			setIsLoading((prev) => ({
				...prev,
				clientError: false
			}));
		}
	};
	const handleServerError = async () => {
		setIsLoading((prev) => ({
			...prev,
			serverError: true
		}));
		try {
			await Sentry.startSpan({
				name: "Server Error Flow Demo",
				op: "demo.server-error"
			}, async () => {
				Sentry.setContext("demo", {
					feature: "server-error-demo",
					triggered_at: (/* @__PURE__ */ new Date()).toISOString()
				});
				await badServerFunc();
			});
		} catch (error) {
			Sentry.captureException(error);
			setResults((prev) => ({
				...prev,
				serverError: {
					type: "error",
					spanOp: "demo.server-error"
				}
			}));
		} finally {
			setIsLoading((prev) => ({
				...prev,
				serverError: false
			}));
		}
	};
	const handleClientTrace = async () => {
		setIsLoading((prev) => ({
			...prev,
			clientTrace: true
		}));
		await Sentry.startSpan({
			name: "Client Operation",
			op: "demo.client-trace"
		}, async () => {
			await new Promise((resolve) => setTimeout(resolve, 1e3));
		});
		setResults((prev) => ({
			...prev,
			clientTrace: {
				type: "success",
				spanOp: "demo.client-trace"
			}
		}));
		setIsLoading((prev) => ({
			...prev,
			clientTrace: false
		}));
	};
	const handleServerTrace = async () => {
		setIsLoading((prev) => ({
			...prev,
			serverTrace: true
		}));
		try {
			await Sentry.startSpan({
				name: "Server Operation",
				op: "demo.server-trace"
			}, async () => {
				await goodServerFunc();
			});
			setResults((prev) => ({
				...prev,
				serverTrace: {
					type: "success",
					spanOp: "demo.server-trace"
				}
			}));
		} finally {
			setIsLoading((prev) => ({
				...prev,
				serverTrace: false
			}));
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen text-white",
		style: {
			fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", sans-serif",
			background: "linear-gradient(180deg, #181423 0%, #1C1825 50%, #181423 100%)"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-5xl mx-auto px-6 py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-4 mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[#7553FF]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SentryLogo, { size: 56 })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-3xl font-bold text-white tracking-tight",
								children: "Sentry Demo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[#A49FB5] text-sm",
								children: "Error monitoring & performance tracing"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-lg text-[#A49FB5] max-w-xl mx-auto leading-relaxed",
						children: [
							"Click the buttons below to trigger errors and traces, then view them in your",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://sentry.io",
								target: "_blank",
								rel: "noopener noreferrer",
								className: "text-[#7553FF] hover:text-[#B3A1FF] underline transition-colors",
								children: "Sentry dashboard"
							}),
							"."
						]
					})]
				}),
				showWarning && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 flex items-center gap-3 bg-[#E5A000]/10 border border-[#E5A000]/30 rounded-xl px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						className: "w-6 h-6 text-[#E5A000] flex-shrink-0",
						fill: "none",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						strokeWidth: "2",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: "Warning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[#E5A000] font-medium",
						children: "Sentry is not initialized"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[#A49FB5] text-sm mt-1",
						children: [
							"Set the",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "bg-[#1C1825] px-1.5 py-0.5 rounded text-[#B3A1FF]",
								children: "VITE_SENTRY_DSN"
							}),
							" ",
							"environment variable to enable error tracking and performance monitoring."
						]
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								className: "w-6 h-6",
								fill: "currentColor",
								viewBox: "0 0 24 24",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" })
							}),
							title: "Error Monitoring",
							description: "Client & server error tracking"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								className: "w-6 h-6",
								fill: "currentColor",
								viewBox: "0 0 24 24",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M13 3v18h-2V3h2zm6 6v12h-2V9h2zM7 14v7H5v-7h2z" })
							}),
							title: "Performance",
							description: "Tracing and spans visualization"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								className: "w-6 h-6",
								fill: "currentColor",
								viewBox: "0 0 24 24",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" })
							}),
							title: "Session Replay",
							description: "Real user session playback"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								className: "w-6 h-6",
								fill: "currentColor",
								viewBox: "0 0 24 24",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" })
							}),
							title: "Real-time Alerts",
							description: "Instant issue notifications"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-[#1C1825] rounded-2xl p-8 border border-[#2D2640]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-3 h-3 rounded-full bg-[#00F261]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-semibold",
								children: "Client-Side Testing"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SentryButton, {
									variant: "error",
									onClick: handleClientError,
									loading: isLoading.clientError,
									disabled: sentryConfigured === false,
									children: "Trigger Client Error"
								}),
								isLoading.clientError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, { loading: isLoading.clientError }),
								results.clientError && !isLoading.clientError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultBadge, {
									type: results.clientError.type,
									spanOp: results.clientError.spanOp,
									onCopy: () => {}
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SentryButton, {
									variant: "primary",
									onClick: handleClientTrace,
									loading: isLoading.clientTrace,
									disabled: sentryConfigured === false,
									children: "Test Client Trace"
								}),
								isLoading.clientTrace && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, { loading: isLoading.clientTrace }),
								results.clientTrace && !isLoading.clientTrace && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultBadge, {
									type: results.clientTrace.type,
									spanOp: results.clientTrace.spanOp,
									onCopy: () => {}
								})
							] })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-[#1C1825] rounded-2xl p-8 border border-[#2D2640]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-3 h-3 rounded-full bg-[#7553FF]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-semibold",
								children: "Server-Side Testing"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SentryButton, {
									variant: "error",
									onClick: handleServerError,
									loading: isLoading.serverError,
									disabled: sentryConfigured === false,
									children: "Trigger Server Error"
								}),
								isLoading.serverError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, { loading: isLoading.serverError }),
								results.serverError && !isLoading.serverError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultBadge, {
									type: results.serverError.type,
									spanOp: results.serverError.spanOp,
									onCopy: () => {}
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SentryButton, {
									variant: "primary",
									onClick: handleServerTrace,
									loading: isLoading.serverTrace,
									disabled: sentryConfigured === false,
									children: "Test Server Trace"
								}),
								isLoading.serverTrace && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, { loading: isLoading.serverTrace }),
								results.serverTrace && !isLoading.serverTrace && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultBadge, {
									type: results.serverTrace.type,
									spanOp: results.serverTrace.spanOp,
									onCopy: () => {}
								})
							] })]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-[#6E6C75]",
						children: [
							"This page uses",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "bg-[#1C1825] px-2 py-1 rounded text-[#B3A1FF]",
								children: "@sentry/tanstackstart-react"
							}),
							" ",
							"for full-stack error monitoring.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/",
								target: "_blank",
								rel: "noopener noreferrer",
								className: "text-[#7553FF] hover:text-[#B3A1FF] underline transition-colors",
								children: "Read the documentation →"
							})
						]
					})
				})
			]
		})
	});
}
//#endregion
export { RouteComponent as component };
