import { o as __toESM } from "../_runtime.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as HOUSE_COLORS, r as HOUSE_NAMES, t as HOUSES } from "./types-CI3p7Lsl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/results-E6ij8Ew1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Results() {
	const [candidates, setCandidates] = (0, import_react.useState)([]);
	const [totalVotes, setTotalVotes] = (0, import_react.useState)(0);
	const [lastUpdate, setLastUpdate] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	(0, import_react.useEffect)(() => {
		fetchResults();
		const interval = setInterval(fetchResults, 1e4);
		return () => clearInterval(interval);
	}, []);
	const fetchResults = async () => {
		try {
			const data = await (await fetch("/api/election/results")).json();
			setCandidates(data.candidates || []);
			setTotalVotes(data.electionState?.totalVotes || 0);
			setLastUpdate(/* @__PURE__ */ new Date());
		} catch (error) {
			console.error("Failed to fetch results:", error);
		}
	};
	const headBoys = candidates.filter((c) => c.position === "head_boy");
	const headGirls = candidates.filter((c) => c.position === "head_girl");
	const getLeader = (candidateList) => {
		if (candidateList.length === 0) return null;
		return candidateList.reduce((max, c) => c.voteCount > max.voteCount ? c : max);
	};
	const renderCandidateCard = (candidate, isLeader) => {
		const maxVotes = Math.max(...candidates.map((c) => c.voteCount || 0), 1);
		const percentage = (candidate.voteCount || 0) / maxVotes * 100;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `p-4 rounded-xl border-2 ${isLeader ? "border-yellow-400 bg-yellow-50 shadow-lg" : "border-gray-200 bg-white"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: `/images/${candidate.photoImage}`,
						alt: candidate.name,
						className: "w-16 h-16 object-cover rounded-full"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-gray-800 text-sm",
								children: candidate.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-gray-600 mb-1",
								children: candidate.symbol
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full bg-gray-200 rounded-full h-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-blue-600 h-2 rounded-full transition-all duration-500",
									style: { width: `${percentage}%` }
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl font-bold text-blue-600",
							children: candidate.voteCount || 0
						}), isLeader && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-yellow-600",
							children: "👑 Leader"
						})]
					})
				]
			})
		}, candidate.id);
	};
	const renderHousePanel = (house) => {
		const houseCandidates = candidates.filter((c) => c.house === house && c.position === "house_captain");
		const leader = getLeader(houseCandidates);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-2xl shadow-lg p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: `text-xl font-bold text-white mb-4 p-2 rounded-lg text-center ${HOUSE_COLORS[house]}`,
				children: HOUSE_NAMES[house]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: houseCandidates.map((candidate) => renderCandidateCard(candidate, candidate.id === leader?.id))
			})]
		}, house);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white rounded-2xl shadow-lg p-4 mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold text-blue-900",
						children: "Student Council Election 2083 - Live Results"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg text-gray-600",
						children: "Shree Baljyoti Secondary School"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-2xl font-bold text-blue-600",
							children: ["Total Votes: ", totalVotes]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-gray-500",
							children: ["Last updated: ", lastUpdate.toLocaleTimeString()]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-2xl shadow-lg p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold text-blue-900 mb-4 text-center border-b-2 border-blue-200 pb-2",
						children: "Head Boys"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: headBoys.map((candidate) => {
							const leader = getLeader(headBoys);
							return renderCandidateCard(candidate, candidate.id === leader?.id);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-2xl shadow-lg p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold text-pink-900 mb-4 text-center border-b-2 border-pink-200 pb-2",
						children: "Head Girls"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: headGirls.map((candidate) => {
							const leader = getLeader(headGirls);
							return renderCandidateCard(candidate, candidate.id === leader?.id);
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-4 gap-4",
				children: HOUSES.map((house) => renderHousePanel(house))
			})
		]
	});
}
//#endregion
export { Results as component };
