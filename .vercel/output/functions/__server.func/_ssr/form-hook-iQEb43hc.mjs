import { o as __toESM } from "../_runtime.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as createFormHook } from "../_libs/@tanstack/react-form+[...].mjs";
import { n as cn } from "./label-DcV41EZS.mjs";
import { d as formContext, p as useFormContext, u as fieldContext } from "./form-provider-5JY4i8Sj.mjs";
import { t as Button } from "./demo.form-aLZ_jxGb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/form-hook-iQEb43hc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card",
		className: cn("flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card-content",
		className: cn("px-6", className),
		...props
	});
}
function CardFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card-footer",
		className: cn("flex items-center px-6 [.border-t]:pt-6", className),
		...props
	});
}
var TextInput = (0, import_react.lazy)(() => import("./text-input-CmL8aL5d.mjs"));
var TextAreaInput = (0, import_react.lazy)(() => import("./text-area-input-Dvwnphbm.mjs"));
var SelectInput = (0, import_react.lazy)(() => import("./select-input-BTChHhDp.mjs"));
var CheckboxInput = (0, import_react.lazy)(() => import("./checkbox-input-UcVeZg4a.mjs"));
var RadioInput = (0, import_react.lazy)(() => import("./radio-input-CIwHOMi7.mjs"));
var SwitchInput = (0, import_react.lazy)(() => import("./switch-input-BAYPhKlD.mjs"));
var SubordinatesInput = (0, import_react.lazy)(() => import("./subordinates-kZG65DW9.mjs"));
function SubscribeButtons() {
	const form = useFormContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
		selector: (state) => ({
			isSubmitting: state.isSubmitting,
			isValid: state.isValid,
			isDirty: state.isDirty
		}),
		children: ({ isSubmitting, isValid, isDirty }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: isSubmitting || !isValid,
				children: isSubmitting ? "Submitting..." : "Submit"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				disabled: isSubmitting || !isDirty,
				onClick: () => form.reset(),
				children: "Reset"
			})]
		})
	});
}
var { useAppForm, withForm, withFieldGroup } = createFormHook({
	fieldComponents: {
		TextInput,
		TextAreaInput,
		SelectInput,
		CheckboxInput,
		RadioInput,
		SwitchInput,
		SubordinatesInput
	},
	formComponents: { SubscribeButtons },
	fieldContext,
	formContext
});
//#endregion
export { withFieldGroup as a, useAppForm as i, CardContent as n, withForm as o, CardFooter as r, Card as t };
