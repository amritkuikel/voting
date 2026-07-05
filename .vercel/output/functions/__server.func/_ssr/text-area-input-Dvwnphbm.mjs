import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useStore } from "../_libs/@tanstack/react-form+[...].mjs";
import { f as useFieldContext, i as FieldError, o as FieldLabel, t as Field } from "./form-provider-5JY4i8Sj.mjs";
import { l as Textarea } from "./demo.form-aLZ_jxGb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/text-area-input-Dvwnphbm.js
var import_jsx_runtime = require_jsx_runtime();
function TextAreaInput({ label, placeholder }) {
	const field = useFieldContext();
	const value = useStore(field.store, (state) => state.value);
	const errors = useStore(field.store, (state) => state.meta.errors);
	const isTouched = useStore(field.store, (state) => state.meta.isTouched);
	const isValid = useStore(field.store, (state) => state.meta.isValid);
	const isInvalid = isTouched && !isValid;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
		"data-invalid": isInvalid,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: label }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				id: field.name,
				name: field.name,
				value,
				onBlur: field.handleBlur,
				onChange: (e) => field.handleChange(e.target.value),
				"aria-invalid": isInvalid,
				placeholder,
				autoComplete: "off"
			}),
			isInvalid && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { errors })
		]
	});
}
//#endregion
export { TextAreaInput as default };
