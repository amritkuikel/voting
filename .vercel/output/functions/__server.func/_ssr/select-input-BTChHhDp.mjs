import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useStore } from "../_libs/@tanstack/react-form+[...].mjs";
import { f as useFieldContext, i as FieldError, n as FieldContent, o as FieldLabel, r as FieldDescription, t as Field } from "./form-provider-5JY4i8Sj.mjs";
import { a as SelectItem, i as SelectContent, o as SelectTrigger, r as Select$2, s as SelectValue } from "./demo.form-aLZ_jxGb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/select-input-BTChHhDp.js
var import_jsx_runtime = require_jsx_runtime();
function SelectInput({ label, description, placeholder, options }) {
	const field = useFieldContext();
	const value = useStore(field.store, (state) => state.value);
	const errors = useStore(field.store, (state) => state.meta.errors);
	const isTouched = useStore(field.store, (state) => state.meta.isTouched);
	const isValid = useStore(field.store, (state) => state.meta.isValid);
	const isInvalid = isTouched && !isValid;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
		"data-invalid": isInvalid,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FieldContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: label }),
				description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldDescription, { children: description }),
				isInvalid && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { errors })
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select$2, {
				name: field.name,
				value,
				onValueChange: field.handleChange,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					id: field.name,
					"aria-invalid": isInvalid,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
					position: "item-aligned",
					children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: option.value,
						children: option.label
					}, option.value))
				})]
			}),
			isInvalid && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { errors })
		]
	});
}
//#endregion
export { SelectInput as default };
