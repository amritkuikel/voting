import { o as __toESM } from "../_runtime.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as HOUSE_COLORS, r as HOUSE_NAMES, t as HOUSES } from "./types-CI3p7Lsl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vote-BnLOhjjR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CANDIDATES = [
	{
		id: 1,
		name: "Sugam Gomja",
		position: "head_boy",
		symbol: "Book",
		symbolImage: "Book.png",
		photoImage: "Book1.jpg"
	},
	{
		id: 2,
		name: "Saugat Shrestha",
		position: "head_boy",
		symbol: "Sunglass",
		symbolImage: "Sunglass.png",
		photoImage: "Sunglass1.jpg"
	},
	{
		id: 3,
		name: "Prince Bajagain",
		position: "head_boy",
		symbol: "Duster",
		symbolImage: "Duster.jpg",
		photoImage: "Duster1.jpg"
	},
	{
		id: 4,
		name: "Aaditya Chimariya",
		position: "head_boy",
		symbol: "Chair",
		symbolImage: "Chair.png",
		photoImage: "Chair1.jpg"
	},
	{
		id: 5,
		name: "Anshu Pokhrel",
		position: "head_girl",
		symbol: "Belt",
		symbolImage: "Belt.png",
		photoImage: "Belt1.jpg"
	},
	{
		id: 6,
		name: "Krinsha Mainali",
		position: "head_girl",
		symbol: "Table",
		symbolImage: "Table.png",
		photoImage: "Table1.jpg"
	},
	{
		id: 7,
		name: "Arpita Pokhrel",
		position: "head_girl",
		symbol: "Marker",
		symbolImage: "Marker.png",
		photoImage: "Marker1.jpg"
	},
	{
		id: 8,
		name: "Srijana Thing",
		position: "head_girl",
		symbol: "Fan",
		symbolImage: "Fan.png",
		photoImage: "Fan1.jpg"
	},
	{
		id: 9,
		name: "Ajay Ghimire",
		position: "house_captain",
		house: "blue",
		symbol: "Key",
		symbolImage: "Key.png",
		photoImage: "Key1.jpg"
	},
	{
		id: 10,
		name: "Sadikshya Mainali",
		position: "house_captain",
		house: "blue",
		symbol: "Stapler",
		symbolImage: "Stapler.png",
		photoImage: "Stapler1.jpg"
	},
	{
		id: 11,
		name: "Ayusha Ghimire",
		position: "house_captain",
		house: "blue",
		symbol: "Tap",
		symbolImage: "Tap.png",
		photoImage: "Tap1.jpg"
	},
	{
		id: 12,
		name: "Punam Adhikari",
		position: "house_captain",
		house: "blue",
		symbol: "House",
		symbolImage: "house.png",
		photoImage: "house1.jpg"
	},
	{
		id: 13,
		name: "Archand Thada Magar",
		position: "house_captain",
		house: "yellow",
		symbol: "Bicycle",
		symbolImage: "bicycle.png",
		photoImage: "bicycle1.jpg"
	},
	{
		id: 14,
		name: "Roshan Bishwokarma",
		position: "house_captain",
		house: "yellow",
		symbol: "Flower",
		symbolImage: "flower.png",
		photoImage: "Flower1.jpg"
	},
	{
		id: 15,
		name: "Subodh Khanal",
		position: "house_captain",
		house: "yellow",
		symbol: "Bulb",
		symbolImage: "Bulb.png",
		photoImage: "Bulb1.jpg"
	},
	{
		id: 16,
		name: "Puspa Ale Magar",
		position: "house_captain",
		house: "yellow",
		symbol: "Monitor",
		symbolImage: "Monitor.png",
		photoImage: "Monitor1.jpg"
	},
	{
		id: 17,
		name: "Aaditya Lakai",
		position: "house_captain",
		house: "red",
		symbol: "Tie",
		symbolImage: "Tie.png",
		photoImage: "Tie1.jpg"
	},
	{
		id: 18,
		name: "Swornima Pokhrel",
		position: "house_captain",
		house: "red",
		symbol: "Geometry Box",
		symbolImage: "Geometry Box.jpg",
		photoImage: "Geometry Box1.jpg"
	},
	{
		id: 19,
		name: "Mandip Magar",
		position: "house_captain",
		house: "red",
		symbol: "Mouse",
		symbolImage: "Mouse.png",
		photoImage: "Mouse1.jpg"
	},
	{
		id: 20,
		name: "Ujjwal Poudel",
		position: "house_captain",
		house: "red",
		symbol: "Umbrella",
		symbolImage: "umbrella.png",
		photoImage: "Umbrella1.jpg"
	},
	{
		id: 21,
		name: "Rubus Parajuli",
		position: "house_captain",
		house: "green",
		symbol: "Keyboard",
		symbolImage: "Keyboard.png",
		photoImage: "Keyboard1.jpg"
	},
	{
		id: 22,
		name: "Santosh Gole",
		position: "house_captain",
		house: "green",
		symbol: "Bottle",
		symbolImage: "Bottle.png",
		photoImage: "Bottle1.jpg"
	},
	{
		id: 23,
		name: "Nancy Neupane",
		position: "house_captain",
		house: "green",
		symbol: "Watch",
		symbolImage: "Watch.png",
		photoImage: "Watch1.jpg"
	},
	{
		id: 24,
		name: "Priyanka Chaudhary",
		position: "house_captain",
		house: "green",
		symbol: "Speaker",
		symbolImage: "Speaker.png",
		photoImage: "Speaker1.jpg"
	}
];
function getCandidatesByPosition(position) {
	return CANDIDATES.filter((c) => c.position === position);
}
function getCandidatesByHouse(house) {
	return CANDIDATES.filter((c) => c.house === house);
}
function Vote() {
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)(1);
	const [session, setSession] = (0, import_react.useState)({
		headBoySelection: null,
		headGirlSelection: null,
		houseSelection: null,
		houseCaptainSelection: null
	});
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (localStorage.getItem("voting_session") !== "true") navigate({ to: "/vote-login" });
	}, [navigate]);
	const headBoys = getCandidatesByPosition("head_boy");
	const headGirls = getCandidatesByPosition("head_girl");
	const handleHeadBoySelect = (candidateId) => {
		setSession((prev) => ({
			...prev,
			headBoySelection: candidateId
		}));
	};
	const handleHeadGirlSelect = (candidateId) => {
		setSession((prev) => ({
			...prev,
			headGirlSelection: candidateId
		}));
	};
	const handleHouseSelect = (house) => {
		setSession((prev) => ({
			...prev,
			houseSelection: house,
			houseCaptainSelection: null
		}));
	};
	const handleHouseCaptainSelect = (candidateId) => {
		setSession((prev) => ({
			...prev,
			houseCaptainSelection: candidateId
		}));
	};
	const handleNext = () => {
		if (step < 4) setStep(step + 1);
		else handleSubmit();
	};
	const handleSubmit = async () => {
		setIsSubmitting(true);
		setError(null);
		try {
			const response = await fetch("/api/election/vote", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					headBoyCandidateId: session.headBoySelection,
					headGirlCandidateId: session.headGirlSelection,
					selectedHouse: session.houseSelection,
					houseCaptainCandidateId: session.houseCaptainSelection
				})
			});
			const data = await response.json();
			if (response.ok && data.success) {
				setStep(5);
				setIsSubmitting(false);
			} else {
				console.error("Vote submission failed:", data.error);
				setError(`Failed to submit vote: ${data.error || "Unknown error"}`);
				setIsSubmitting(false);
			}
		} catch (error) {
			console.error("Failed to submit vote:", error);
			setError("Failed to submit vote. Please try again.");
			setIsSubmitting(false);
		}
	};
	const handleNextStudent = () => {
		localStorage.removeItem("voting_session");
		localStorage.removeItem("voting_credential");
		setStep(1);
		setSession({
			headBoySelection: null,
			headGirlSelection: null,
			houseSelection: null,
			houseCaptainSelection: null
		});
		navigate({ to: "/vote-login" });
	};
	const canProceed = () => {
		switch (step) {
			case 1: return session.headBoySelection !== null;
			case 2: return session.headGirlSelection !== null;
			case 3: return session.houseSelection !== null;
			case 4: return session.houseCaptainSelection !== null;
			default: return false;
		}
	};
	const renderStep = () => {
		switch (step) {
			case 1: return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fade-in animate-in slide-in-from-bottom-4 duration-500",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-4xl font-bold text-blue-900 mb-2 text-center",
						children: "HEAD BOY ELECTION"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg text-gray-600 mb-8 text-center",
						children: "Select a symbol to vote"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-6",
						children: headBoys.map((candidate) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleHeadBoySelect(candidate.id),
							className: `p-8 rounded-3xl border-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${session.headBoySelection === candidate.id ? "border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl ring-4 ring-blue-300" : "border-gray-200 bg-white hover:border-blue-400 hover:shadow-lg"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: `/images/${candidate.symbolImage}`,
										alt: candidate.symbol,
										className: "w-24 h-24 object-contain",
										onError: (e) => {
											const img = e.target;
											img.style.display = "none";
											const parent = img.parentElement;
											if (parent) parent.innerHTML = `<span class="text-4xl font-bold text-blue-600">${candidate.symbol.charAt(0)}</span>`;
										}
									})
								}), session.headBoySelection === candidate.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
										className: "w-5 h-5 text-white",
										fill: "none",
										stroke: "currentColor",
										viewBox: "0 0 24 24",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											strokeWidth: "3",
											d: "M5 13l4 4L19 7"
										})
									})
								})]
							})
						}, candidate.id))
					})
				]
			});
			case 2: return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fade-in animate-in slide-in-from-bottom-4 duration-500",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-4xl font-bold text-pink-900 mb-2 text-center",
						children: "HEAD GIRL ELECTION"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg text-gray-600 mb-8 text-center",
						children: "Select a symbol to vote"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-6",
						children: headGirls.map((candidate) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleHeadGirlSelect(candidate.id),
							className: `p-8 rounded-3xl border-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${session.headGirlSelection === candidate.id ? "border-pink-600 bg-gradient-to-br from-pink-50 to-pink-100 shadow-2xl ring-4 ring-pink-300" : "border-gray-200 bg-white hover:border-pink-400 hover:shadow-lg"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-32 h-32 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mb-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: `/images/${candidate.symbolImage}`,
										alt: candidate.symbol,
										className: "w-24 h-24 object-contain",
										onError: (e) => {
											const img = e.target;
											img.style.display = "none";
											const parent = img.parentElement;
											if (parent) parent.innerHTML = `<span class="text-4xl font-bold text-pink-600">${candidate.symbol.charAt(0)}</span>`;
										}
									})
								}), session.headGirlSelection === candidate.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center mt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
										className: "w-5 h-5 text-white",
										fill: "none",
										stroke: "currentColor",
										viewBox: "0 0 24 24",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											strokeWidth: "3",
											d: "M5 13l4 4L19 7"
										})
									})
								})]
							})
						}, candidate.id))
					})
				]
			});
			case 3: return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fade-in animate-in slide-in-from-bottom-4 duration-500",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-4xl font-bold text-blue-900 mb-2 text-center",
						children: "HOUSE SELECTION"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg text-gray-600 mb-8 text-center",
						children: "Select your house"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-6",
						children: HOUSES.map((house) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleHouseSelect(house),
							className: `p-12 rounded-3xl border-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${session.houseSelection === house ? "border-blue-600 shadow-2xl ring-4 ring-blue-300" : "border-gray-200 hover:border-blue-400 hover:shadow-lg"} ${HOUSE_COLORS[house]}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-white text-3xl font-bold mb-2",
									children: HOUSE_NAMES[house]
								}), session.houseSelection === house && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-8 h-8 bg-white rounded-full flex items-center justify-center mt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
										className: "w-5 h-5 text-blue-600",
										fill: "none",
										stroke: "currentColor",
										viewBox: "0 0 24 24",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											strokeWidth: "3",
											d: "M5 13l4 4L19 7"
										})
									})
								})]
							})
						}, house))
					})
				]
			});
			case 4:
				const houseCandidates = session.houseSelection ? getCandidatesByHouse(session.houseSelection) : [];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "fade-in animate-in slide-in-from-bottom-4 duration-500",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-4xl font-bold text-blue-900 mb-2 text-center",
							children: "HOUSE CAPTAIN ELECTION"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xl text-gray-600 mb-2 text-center",
							children: HOUSE_NAMES[session.houseSelection]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg text-gray-500 mb-8 text-center",
							children: "Select a symbol to vote"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-6",
							children: houseCandidates.map((candidate) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleHouseCaptainSelect(candidate.id),
								className: `p-8 rounded-3xl border-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${session.houseCaptainSelection === candidate.id ? "border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl ring-4 ring-blue-300" : "border-gray-200 bg-white hover:border-blue-400 hover:shadow-lg"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: `/images/${candidate.symbolImage}`,
											alt: candidate.symbol,
											className: "w-24 h-24 object-contain",
											onError: (e) => {
												const img = e.target;
												img.style.display = "none";
												const parent = img.parentElement;
												if (parent) parent.innerHTML = `<span class="text-4xl font-bold text-blue-600">${candidate.symbol.charAt(0)}</span>`;
											}
										})
									}), session.houseCaptainSelection === candidate.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mt-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
											className: "w-5 h-5 text-white",
											fill: "none",
											stroke: "currentColor",
											viewBox: "0 0 24 24",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
												strokeLinecap: "round",
												strokeLinejoin: "round",
												strokeWidth: "3",
												d: "M5 13l4 4L19 7"
											})
										})
									})]
								})
							}, candidate.id))
						})
					]
				});
			case 5: return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fade-in animate-in slide-in-from-bottom-4 duration-500 text-center py-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							className: "w-16 h-16 text-green-600",
							fill: "none",
							stroke: "currentColor",
							viewBox: "0 0 24 24",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeWidth: "3",
								d: "M5 13l4 4L19 7"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-4xl font-bold text-green-600 mb-4",
						children: "Thank You for Voting!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xl text-gray-600 mb-8",
						children: "Your vote has been successfully submitted."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleNextStudent,
						className: "px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105",
						children: "Next Student"
					})
				]
			});
			default: return null;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col items-center justify-center p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-4xl w-full border border-white/50",
			children: [
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							className: "w-6 h-6",
							fill: "none",
							stroke: "currentColor",
							viewBox: "0 0 24 24",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeWidth: "2",
								d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => navigate({ to: "/" }),
						className: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors",
						children: "Go Home"
					})]
				}),
				renderStep(),
				step < 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex justify-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => navigate({ to: "/" }),
						className: "px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xl font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105",
						children: "Home"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleNext,
						disabled: !canProceed() || isSubmitting,
						className: "px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white text-2xl font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100",
						children: step === 4 ? "SUBMIT VOTE" : "NEXT"
					})]
				}),
				step < 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex justify-center gap-2",
					children: [
						1,
						2,
						3,
						4
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-2 rounded-full transition-all duration-300 ${s === step ? "w-8 bg-gradient-to-r from-indigo-600 to-purple-600" : "w-2 bg-gray-300"}` }, s))
				})
			]
		})
	});
}
//#endregion
export { Vote as component };
