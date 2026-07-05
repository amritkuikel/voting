import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useStore } from "../_libs/@tanstack/react-form+[...].mjs";
import { n as CheckboxIndicator, t as Checkbox } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as cn } from "./label-DcV41EZS.mjs";
import { a as FieldGroup, c as FieldSet, f as useFieldContext, i as FieldError, o as FieldLabel, r as FieldDescription, s as FieldLegend, t as Field } from "./form-provider-5JY4i8Sj.mjs";
import { a as Check } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkbox-input-UcVeZg4a.js
var import_jsx_runtime = require_jsx_runtime();
function Checkbox$1({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
		"data-slot": "checkbox",
		className: cn("peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[state=checked]:bg-primary", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
			"data-slot": "checkbox-indicator",
			className: "grid place-content-center text-current transition-none",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" })
		})
	});
}
function CheckboxInput({ label, description, options }) {
	const field = useFieldContext();
	const state = useStore(field.store, (state) => state);
	const isInvalid = state.meta.isTouched && !state.meta.isValid;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FieldSet, { children: [
		label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLegend, {
			variant: "label",
			children: label
		}),
		description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldDescription, { children: description }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldGroup, {
			"data-slot": "checkbox-group",
			children: options.map((item) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
					orientation: "horizontal",
					"data-invalid": isInvalid,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
						id: `checkbox-item-${item.value}`,
						name: field.name,
						"aria-invalid": isInvalid,
						checked: state.value.includes(item.value),
						onCheckedChange: (checked) => {
							if (checked) field.pushValue(item.value);
							else {
								const index = state.value.indexOf(item.value);
								if (index > -1) field.removeValue(index);
							}
						}
					}, `checkbox-item-${item.value}`), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
						htmlFor: `checkbox-item-${item.value}`,
						children: item.label
					})]
				}, item.value);
			})
		}),
		isInvalid && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { errors: state.meta.errors })
	] });
}
//#endregion
export { CheckboxInput as default };
