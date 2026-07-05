import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useStore } from "../_libs/@tanstack/react-form+[...].mjs";
import { n as Item2, r as Root2, t as Indicator } from "../_libs/@radix-ui/react-radio-group+[...].mjs";
import { n as cn } from "./label-DcV41EZS.mjs";
import { c as FieldSet, f as useFieldContext, l as FieldTitle, n as FieldContent, o as FieldLabel, r as FieldDescription, s as FieldLegend, t as Field } from "./form-provider-5JY4i8Sj.mjs";
import { n as Circle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/radio-input-CIwHOMi7.js
var import_jsx_runtime = require_jsx_runtime();
function RadioGroup$1({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2, {
		"data-slot": "radio-group",
		className: cn("grid gap-3", className),
		...props
	});
}
function RadioGroupItem({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		"data-slot": "radio-group-item",
		className: cn("aspect-square size-4 shrink-0 rounded-full border border-input text-primary shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
			"data-slot": "radio-group-indicator",
			className: "relative flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-primary" })
		})
	});
}
function RadioInput({ label, description, options }) {
	const field = useFieldContext();
	const store = useStore(field.store, (state) => state);
	const isInvalid = store.meta.isTouched && !store.meta.isValid;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FieldSet, { children: [
		label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLegend, {
			variant: "label",
			children: label
		}),
		description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldDescription, { children: description }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup$1, {
			name: field.name,
			value: store.value,
			onValueChange: field.handleChange,
			children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
				htmlFor: `form-tanstack-radiogroup-${option.value}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
					orientation: "horizontal",
					"data-invalid": isInvalid,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FieldContent, { children: [option.label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldTitle, { children: option.label }), option.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldDescription, { children: option.description })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
						value: option.value,
						id: `form-tanstack-radiogroup-${option.value}`,
						"aria-invalid": isInvalid
					})]
				})
			}, option.value))
		})
	] });
}
//#endregion
export { RadioInput as default };
