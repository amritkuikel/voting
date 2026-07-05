import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useStore } from "../_libs/@tanstack/react-form+[...].mjs";
import { f as useFieldContext, i as FieldError, n as FieldContent, o as FieldLabel, r as FieldDescription, t as Field } from "./form-provider-5JY4i8Sj.mjs";
import { c as Switch$1 } from "./demo.form-aLZ_jxGb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/switch-input-BAYPhKlD.js
var import_jsx_runtime = require_jsx_runtime();
function SwitchInput({ label, description }) {
	const field = useFieldContext();
	const state = useStore(field.store, (state) => state);
	const isInvalid = state.meta.isTouched && !state.meta.isValid;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
		orientation: "horizontal",
		"data-invalid": isInvalid,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FieldContent, { children: [
			label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
				htmlFor: field.name,
				children: label
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldDescription, { children: description }),
			isInvalid && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { errors: state.meta.errors })
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
			id: field.name,
			name: field.name,
			checked: state.value,
			onCheckedChange: field.handleChange,
			"aria-invalid": isInvalid
		})]
	});
}
//#endregion
export { SwitchInput as default };
