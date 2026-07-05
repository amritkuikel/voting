import { o as __toESM } from "../_runtime.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { u as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as usePostHog } from "../_libs/posthog-js+posthog__react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/posthog-B7y78OHf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PostHogDemo() {
	const posthog = usePostHog();
	const [eventCount, setEventCount] = (0, import_react.useState)(0);
	const isConfigured = Boolean("phc_AqF5rYyEP2ZYppeMKtQ6aTSTbKohpuucAQLQBC9nwz4W") && true;
	const trackEvent = (eventName, properties) => {
		posthog.capture(eventName, properties);
		setEventCount((c) => c + 1);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gray-900 text-white p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md mx-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold mb-6",
					children: "PostHog Demo"
				}),
				!isConfigured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 p-4 bg-yellow-900/50 border border-yellow-600 rounded-lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-yellow-200 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Warning:" }),
							" VITE_POSTHOG_KEY is not configured. Events won't be sent to PostHog. Add it to your",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "bg-yellow-900 px-1 rounded",
								children: ".env"
							}),
							" file."
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-gray-800 rounded-lg p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-gray-400 mb-4",
							children: "Click the button below to send events to PostHog. Check your PostHog dashboard to see them appear in real-time."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => trackEvent("button_clicked", { button: "demo" }),
							className: "w-full bg-cyan-600 hover:bg-cyan-700 px-4 py-3 rounded font-medium",
							children: "Track Click"
						}),
						isConfigured && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 p-4 bg-gray-700 rounded",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-gray-400",
								children: "Events sent this session:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-4xl font-bold text-cyan-400",
								children: eventCount
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-sm text-gray-400",
					children: [
						"Open your",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://app.posthog.com/events",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-cyan-400 hover:text-cyan-300 underline",
							children: "PostHog Events"
						}),
						" ",
						"page to see these events appear."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-gray-400",
					children: [
						"Learn more in the",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://posthog.com/docs/libraries/react",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-cyan-400 hover:text-cyan-300 underline",
							children: "PostHog React docs"
						}),
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "text-cyan-400 hover:text-cyan-300",
						children: "← Back to Home"
					})
				})
			]
		})
	});
}
//#endregion
export { PostHogDemo as component };
