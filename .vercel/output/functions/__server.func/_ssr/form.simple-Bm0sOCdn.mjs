import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as formOptions } from "../_libs/@tanstack/form-core+[...].mjs";
import { a as FieldGroup } from "./form-provider-5JY4i8Sj.mjs";
import { h as object, t as zod_default, v as string } from "../_libs/zod.mjs";
import { u as useAppForm } from "./demo.form-aLZ_jxGb.mjs";
import { i as useAppForm$1, n as CardContent, o as withForm, r as CardFooter, t as Card } from "./form-hook-iQEb43hc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/form.simple-Bm0sOCdn.js
var import_jsx_runtime = require_jsx_runtime();
var formSchema = zod_default.object({
	email: zod_default.string().email("Invalid email address"),
	password: zod_default.string().min(8, "Password must be at least 8 characters."),
	description: zod_default.string().min(10),
	gender: zod_default.enum(["male", "female"]),
	roles: zod_default.array(zod_default.enum(["admin", "user"])),
	tasks: zod_default.enum([
		"task1",
		"task2",
		"task3"
	]),
	isEnabled: zod_default.boolean(),
	subordinates: zod_default.array(zod_default.object({
		email: zod_default.string().email("Invalid email address"),
		password: zod_default.string().min(8, "Password must be at least 8 characters."),
		description: zod_default.string().min(10),
		gender: zod_default.enum(["male", "female"]),
		roles: zod_default.array(zod_default.enum(["admin", "user"])),
		tasks: zod_default.enum([
			"task1",
			"task2",
			"task3"
		]),
		isEnabled: zod_default.boolean()
	}))
});
var testFormOptions = formOptions({
	defaultValues: {
		email: "",
		password: "",
		description: "",
		gender: "male",
		roles: ["user"],
		tasks: "task1",
		isEnabled: false,
		subordinates: [{
			email: "",
			password: "",
			description: "",
			gender: "male",
			roles: ["user"],
			tasks: "task1",
			isEnabled: false
		}]
	},
	validators: {
		onBlur: formSchema,
		onSubmit: formSchema
	}
});
/** biome-ignore-all lint/correctness/noChildrenProp: <todo> */
var PartialForm = withForm({
	...testFormOptions,
	render: ({ form }) => {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Partial Form" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
				name: "email",
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.TextInput, {
					label: "email",
					type: "email",
					placeholder: "Enter your email"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
				name: "password",
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.TextInput, {
					label: "password",
					type: "password",
					placeholder: "Enter your password"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
				name: "description",
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.TextAreaInput, {
					label: "description",
					placeholder: "Enter your description"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
				name: "gender",
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.SelectInput, {
					label: "gender",
					options: [{
						value: "male",
						label: "Male"
					}, {
						value: "female",
						label: "Female"
					}]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
				name: "roles",
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.CheckboxInput, {
					label: "roles",
					options: [{
						value: "admin",
						label: "Admin"
					}, {
						value: "user",
						label: "User"
					}]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
				name: "tasks",
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.RadioInput, {
					label: "tasks",
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
				name: "isEnabled",
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.SwitchInput, { label: "isEnabled" })
			})
		] });
	}
});
function TestForm() {
	const form = useAppForm$1({
		...testFormOptions,
		onSubmit: async ({ value }) => {
			console.log(value);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			id: "test-form",
			onSubmit: (e) => {
				e.preventDefault();
				form.handleSubmit(e);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FieldGroup, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartialForm, { form }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
				name: "subordinates",
				mode: "array",
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.SubordinatesInput, {
					label: "Subordinates",
					description: "Add subordinates to the user.",
					form
				})
			})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppForm, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.SubscribeButtons, {}) }) })]
		})
	});
}
var schema = object({
	title: string().min(1, "Title is required"),
	description: string().min(1, "Description is required")
});
function SimpleForm() {
	const form = useAppForm({
		defaultValues: {
			title: "",
			description: ""
		},
		validators: { onBlur: schema },
		onSubmit: ({ value }) => {
			console.log(value);
			alert("Form submitted successfully!");
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-white",
		style: { backgroundImage: "radial-gradient(50% 50% at 5% 40%, #add8e6 0%, #0000ff 70%, #00008b 100%)" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full  max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				},
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
						name: "title",
						children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.TextField, { label: "Title" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
						name: "description",
						children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.TextArea, { label: "Description" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppForm, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.SubscribeButton, { label: "Submit" }) })
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestForm, {})]
	});
}
//#endregion
export { SimpleForm as component };
