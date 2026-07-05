import { o as __toESM } from "../_runtime.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-dashboard-Dazjtrai.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboard() {
	const navigate = useNavigate();
	const [electionState, setElectionState] = (0, import_react.useState)(null);
	const [showConfirm, setShowConfirm] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [sessionError, setSessionError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (localStorage.getItem("admin_session") !== "true") {
			setSessionError("Session not found. Redirecting to login...");
			setTimeout(() => {
				window.location.href = "/admin";
			}, 2e3);
		} else fetchElectionState();
	}, []);
	const fetchElectionState = async () => {
		try {
			setElectionState(await (await fetch("/api/election/state")).json());
		} catch (error) {
			console.error("Failed to fetch election state:", error);
		}
	};
	const handleStartElection = async () => {
		setIsLoading(true);
		try {
			await fetch("/api/election/start", { method: "POST" });
			await fetchElectionState();
			setShowConfirm(null);
		} catch (error) {
			console.error("Failed to start election:", error);
		}
		setIsLoading(false);
	};
	const handleStopElection = async () => {
		setIsLoading(true);
		try {
			await fetch("/api/election/stop", { method: "POST" });
			await fetchElectionState();
			setShowConfirm(null);
		} catch (error) {
			console.error("Failed to stop election:", error);
		}
		setIsLoading(false);
	};
	const handleResetElection = async () => {
		setIsLoading(true);
		try {
			await fetch("/api/election/reset", { method: "POST" });
			await fetchElectionState();
			setShowConfirm(null);
		} catch (error) {
			console.error("Failed to reset election:", error);
		}
		setIsLoading(false);
	};
	const handleExportResults = async () => {
		try {
			const blob = await (await fetch("/api/election/export")).blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "election_results.csv";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Failed to export results:", error);
		}
	};
	const handleLogout = () => {
		localStorage.removeItem("admin_session");
		navigate({ to: "/" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-6xl mx-auto",
			children: [
				sessionError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8",
					children: sessionError
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-4xl font-bold text-blue-900",
						children: "Admin Dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleLogout,
						className: "px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all",
						children: "Logout"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-white rounded-3xl shadow-2xl p-8 mb-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-bold text-gray-800 mb-2",
							children: "Election Status"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-lg text-gray-600",
							children: ["Total Votes: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-blue-600",
								children: electionState?.totalVotes || 0
							})]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `px-8 py-4 rounded-2xl text-2xl font-bold ${electionState?.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`,
							children: electionState?.isActive ? "ACTIVE" : "STOPPED"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowConfirm("start"),
							disabled: electionState?.isActive || isLoading,
							className: "px-6 py-8 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xl font-bold rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100",
							children: "Start Election"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowConfirm("stop"),
							disabled: !electionState?.isActive || isLoading,
							className: "px-6 py-8 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xl font-bold rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100",
							children: "Stop Election"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowConfirm("reset"),
							disabled: isLoading,
							className: "px-6 py-8 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xl font-bold rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100",
							children: "Reset Election"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleExportResults,
							disabled: isLoading,
							className: "px-6 py-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xl font-bold rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100",
							children: "Export Results"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl shadow-2xl p-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold text-gray-800 mb-6",
						children: "Quick Links"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => navigate({ to: "/results" }),
							className: "px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold rounded-xl shadow-lg transition-all",
							children: "View Live Results"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => navigate({ to: "/vote" }),
							className: "px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-xl shadow-lg transition-all",
							children: "Test Voting Interface"
						})]
					})]
				}),
				showConfirm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-2xl font-bold text-gray-800 mb-4",
								children: "Confirm Action"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-lg text-gray-600 mb-8",
								children: [
									showConfirm === "start" && "Are you sure you want to start the election?",
									showConfirm === "stop" && "Are you sure you want to stop the election?",
									showConfirm === "reset" && "Are you sure you want to reset the election? This will delete all votes."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setShowConfirm(null),
									className: "flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-xl transition-all",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										if (showConfirm === "start") handleStartElection();
										if (showConfirm === "stop") handleStopElection();
										if (showConfirm === "reset") handleResetElection();
									},
									disabled: isLoading,
									className: "flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all",
									children: isLoading ? "Processing..." : "Confirm"
								})]
							})
						]
					})
				})
			]
		})
	});
}
//#endregion
export { AdminDashboard as component };
