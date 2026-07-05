import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as useAppForm } from "./demo.form-aLZ_jxGb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/form.address-DYej9q8s.js
var import_jsx_runtime = require_jsx_runtime();
function AddressForm() {
	const form = useAppForm({
		defaultValues: {
			fullName: "",
			email: "",
			address: {
				street: "",
				city: "",
				state: "",
				zipCode: "",
				country: ""
			},
			phone: ""
		},
		validators: { onBlur: ({ value }) => {
			const errors = { fields: {} };
			if (value.fullName.trim().length === 0) errors.fields.fullName = "Full name is required";
			return errors;
		} },
		onSubmit: ({ value }) => {
			console.log(value);
			alert("Form submitted successfully!");
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-white",
		style: { backgroundImage: "radial-gradient(50% 50% at 5% 40%, #f4a460 0%, #8b4513 70%, #1a0f0a 100%)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				},
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
						name: "fullName",
						children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.TextField, { label: "Full Name" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
						name: "email",
						validators: { onBlur: ({ value }) => {
							if (!value || value.trim().length === 0) return "Email is required";
							if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) return "Invalid email address";
						} },
						children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.TextField, { label: "Email" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
						name: "address.street",
						validators: { onBlur: ({ value }) => {
							if (!value || value.trim().length === 0) return "Street address is required";
						} },
						children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.TextField, { label: "Street Address" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-3 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
								name: "address.city",
								validators: { onBlur: ({ value }) => {
									if (!value || value.trim().length === 0) return "City is required";
								} },
								children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.TextField, { label: "City" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
								name: "address.state",
								validators: { onBlur: ({ value }) => {
									if (!value || value.trim().length === 0) return "State is required";
								} },
								children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.TextField, { label: "State" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
								name: "address.zipCode",
								validators: { onBlur: ({ value }) => {
									if (!value || value.trim().length === 0) return "Zip code is required";
									if (!/^\d{5}(-\d{4})?$/.test(value)) return "Invalid zip code format";
								} },
								children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.TextField, { label: "Zip Code" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
						name: "address.country",
						validators: { onBlur: ({ value }) => {
							if (!value || value.trim().length === 0) return "Country is required";
						} },
						children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.Select, {
							label: "Country",
							values: [
								{
									label: "United States",
									value: "US"
								},
								{
									label: "Canada",
									value: "CA"
								},
								{
									label: "United Kingdom",
									value: "UK"
								},
								{
									label: "Australia",
									value: "AU"
								},
								{
									label: "Germany",
									value: "DE"
								},
								{
									label: "France",
									value: "FR"
								},
								{
									label: "Japan",
									value: "JP"
								}
							],
							placeholder: "Select a country"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
						name: "phone",
						validators: { onBlur: ({ value }) => {
							if (!value || value.trim().length === 0) return "Phone number is required";
							if (!/^(\+\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value)) return "Invalid phone number format";
						} },
						children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.TextField, {
							label: "Phone",
							placeholder: "123-456-7890"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppForm, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.SubscribeButton, { label: "Submit" }) })
					})
				]
			})
		})
	});
}
//#endregion
export { AddressForm as component };
