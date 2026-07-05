import { o as __toESM } from "../_runtime.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { u as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-QpHD3uhC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var translations = {
	en: {
		schoolName: "Shree Baljyoti Secondary School",
		location: "Hetauda-5, Makawanpur, Nepal",
		electionTitle: "Student Council Election 2083",
		startVoting: "START VOTING",
		adminLogin: "ADMIN LOGIN",
		demoInfo: "Admin: admin2083 | Voting: vote1-vote10",
		language: "नेपाली"
	},
	ne: {
		schoolName: "श्री बालज्योति माध्यमिक विद्यालय",
		location: "हेटौडा-५, मकवानपुर, नेपाल",
		electionTitle: "विद्यार्थी परिषद निर्वाचन २०८३",
		startVoting: "मतदान सुरु गर्नुहोस्",
		adminLogin: "प्रशासक लगइन",
		demoInfo: "प्रशासक: admin2083 | मतदान: vote1-vote10",
		language: "English"
	}
};
function Home() {
	const [language, setLanguage] = (0, import_react.useState)("en");
	const t = translations[language];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col items-center justify-center p-8 animate-in fade-in duration-1000",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute top-4 right-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setLanguage(language === "en" ? "ne" : "en"),
				className: "px-4 py-2 bg-white/90 backdrop-blur-sm border-2 border-indigo-300 rounded-lg text-indigo-700 font-semibold hover:bg-indigo-50 transition-colors shadow-md",
				children: t.language
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center border border-white/50",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-32 h-32 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/images/logo.png",
							alt: "School Logo",
							className: "w-24 h-24 object-contain",
							onError: (e) => {
								e.target.style.display = "none";
								const parent = e.target.parentElement;
								if (parent) parent.innerHTML = "<span class=\"text-4xl font-bold text-white\">🏫</span>";
							}
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-in slide-in-from-bottom-4 duration-700",
					children: t.schoolName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-gray-600 mb-2 text-lg animate-in slide-in-from-bottom-4 duration-700 delay-100",
					children: t.location
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "my-8 py-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 animate-in slide-in-from-bottom-4 duration-700 delay-200",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent",
						children: t.electionTitle
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row gap-6 justify-center mt-12 animate-in slide-in-from-bottom-4 duration-700 delay-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/vote-login",
						className: "px-12 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-2xl font-bold rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl",
						children: t.startVoting
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin",
						className: "px-12 py-6 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white text-2xl font-bold rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl",
						children: t.adminLogin
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-200 animate-in fade-in duration-1000 delay-500",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-indigo-800 font-semibold",
						children: ["🗳️ ", t.demoInfo]
					})
				})
			]
		})]
	});
}
//#endregion
export { Home as component };
