import { o as __toESM } from "../_runtime.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/storybook-urFyOVQ7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Button = ({ variant = "primary", size = "medium", children, onClick, disabled = false, type = "button", className = "" }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		onClick,
		disabled,
		className: `font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${{
			primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600",
			secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
			danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600"
		}[variant]} ${{
			small: "px-3 py-1.5 text-sm",
			medium: "px-4 py-2 text-base",
			large: "px-6 py-3 text-lg"
		}[size]} ${className}`,
		children
	});
};
var Dialog = ({ title, children, footer, className = "" }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-6 py-4 border-b border-gray-200 dark:border-gray-700",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-semibold text-gray-900 dark:text-gray-100",
					children: title
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-6 py-6",
				children
			}),
			footer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700",
				children: footer
			})
		]
	});
};
var Input = ({ label, id, value = "", onChange, placeholder, required = false, className = "" }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex flex-col gap-2 ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			htmlFor: id,
			className: "text-sm font-medium text-gray-700 dark:text-gray-200",
			children: [label, required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500 ml-1",
				children: "*"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "text",
			id,
			value,
			onChange: (e) => onChange?.(e.target.value),
			placeholder,
			required,
			className: "px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
		})]
	});
};
var RadioGroup = ({ label, name, options, value, onChange, className = "" }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex flex-col gap-3 ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			htmlFor: "label",
			className: "text-sm font-medium text-gray-700 dark:text-gray-200",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-4",
			children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 cursor-pointer group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "radio",
					name,
					value: option.value,
					checked: value === option.value,
					onChange: (e) => onChange?.(e.target.value),
					className: "w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors",
					children: option.label
				})]
			}, option.value))
		})]
	});
};
var Slider = ({ label, id, value = 0, onChange, min = 0, max = 100, step = 1, showValue = true, className = "" }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex flex-col gap-2 ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: id,
					className: "text-sm font-medium text-gray-700 dark:text-gray-200",
					children: label
				}), showValue && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-semibold text-blue-600 dark:text-blue-400 min-w-12 text-right",
					children: value
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "range",
				id,
				value,
				onChange: (e) => onChange?.(Number(e.target.value)),
				min,
				max,
				step,
				className: "w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between text-xs text-gray-500 dark:text-gray-400",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: min }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: max })]
			})
		]
	});
};
function StorybookDemo() {
	const [firstName, setFirstName] = (0, import_react.useState)("");
	const [lastName, setLastName] = (0, import_react.useState)("");
	const [employmentType, setEmploymentType] = (0, import_react.useState)("full-time");
	const [coffeeCups, setCoffeeCups] = (0, import_react.useState)(3);
	const handleSubmit = () => {};
	const handleReset = () => {
		setFirstName("");
		setLastName("");
		setEmploymentType("full-time");
		setCoffeeCups(3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-2xl mx-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				title: "Employee Information Form",
				footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 justify-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						size: "medium",
						onClick: handleReset,
						children: "Reset"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "primary",
						size: "medium",
						type: "submit",
						onClick: handleSubmit,
						children: "Submit"
					})]
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							label: "First Name",
							id: "firstName",
							value: firstName,
							onChange: setFirstName,
							placeholder: "John",
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							label: "Last Name",
							id: "lastName",
							value: lastName,
							onChange: setLastName,
							placeholder: "Doe",
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
							label: "Employment Type",
							name: "employmentType",
							options: [{
								value: "full-time",
								label: "Full Time"
							}, {
								value: "part-time",
								label: "Part Time"
							}],
							value: employmentType,
							onChange: setEmploymentType
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							label: "Coffee Cups Per Day",
							id: "coffeeCups",
							value: coffeeCups,
							onChange: setCoffeeCups,
							min: 0,
							max: 10
						})
					]
				})
			})
		})
	});
}
//#endregion
export { StorybookDemo as component };
