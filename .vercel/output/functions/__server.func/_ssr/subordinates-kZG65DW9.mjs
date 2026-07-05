import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useStore } from "../_libs/@tanstack/react-form+[...].mjs";
import { a as FieldGroup, c as FieldSet, f as useFieldContext, i as FieldError, r as FieldDescription, s as FieldLegend } from "./form-provider-5JY4i8Sj.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
import { t as Button } from "./demo.form-aLZ_jxGb.mjs";
import { a as withFieldGroup, t as Card } from "./form-hook-iQEb43hc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/subordinates-kZG65DW9.js
var import_jsx_runtime = require_jsx_runtime();
/** biome-ignore-all lint/correctness/noChildrenProp: <required> */
var PartialReusableForm = withFieldGroup({
	defaultValues: {
		email: "",
		password: "",
		description: "",
		gender: "male",
		roles: ["user"],
		tasks: "task1",
		isEnabled: false
	},
	render: function Render({ group }) {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Partial Reusable Form" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(group.AppField, {
				name: "email",
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.TextInput, {
					label: "Email",
					type: "email"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(group.AppField, {
				name: "password",
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.TextInput, {
					label: "Password",
					type: "password"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(group.AppField, {
				name: "description",
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.TextAreaInput, { label: "Description" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(group.AppField, {
				name: "gender",
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.SelectInput, {
					label: "Gender",
					options: [{
						value: "male",
						label: "Male"
					}, {
						value: "female",
						label: "Female"
					}]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(group.AppField, {
				name: "roles",
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.CheckboxInput, {
					label: "Roles",
					options: [{
						value: "user",
						label: "User"
					}, {
						value: "admin",
						label: "Admin"
					}]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(group.AppField, {
				name: "tasks",
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.SelectInput, {
					label: "Tasks",
					options: [
						{
							value: "task1",
							label: "Task 1"
						},
						{
							value: "task2",
							label: "Task 2"
						},
						{
							value: "task3",
							label: "Task 3"
						}
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(group.AppField, {
				name: "isEnabled",
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.SwitchInput, { label: "Is Enabled" })
			})
		] });
	}
});
function SubordinatesInput({ label, description, form }) {
	const field = useFieldContext();
	const store = useStore(field.store, (state) => state);
	const isInvalid = store.meta.isTouched && !store.meta.isValid;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FieldSet, {
		"data-invalid": isInvalid,
		children: [
			label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLegend, {
				variant: "label",
				children: label
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldDescription, { children: description }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FieldGroup, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				onClick: () => field.pushValue({
					email: "",
					password: "",
					description: "",
					gender: "male",
					roles: ["user"],
					tasks: "task1",
					isEnabled: false
				}),
				disabled: field.state.value.length >= 5,
				children: "Add Subordinate"
			}), field.state.value.map((a, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartialReusableForm, {
					form,
					fields: {
						email: `subordinates[${index}].email`,
						password: `subordinates[${index}].password`,
						description: `subordinates[${index}].description`,
						gender: `subordinates[${index}].gender`,
						roles: `subordinates[${index}].roles`,
						tasks: `subordinates[${index}].tasks`,
						isEnabled: `subordinates[${index}].isEnabled`
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					onClick: () => field.removeValue(index),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}), " Remove Subordinate"]
				})]
			}, a.email))] }),
			isInvalid && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { errors: field.state.meta.errors })
		]
	});
}
//#endregion
export { SubordinatesInput as default };
