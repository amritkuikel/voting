import { formOptions } from "@tanstack/react-form";
import { formSchema } from "./schema";

export const testFormOptions = formOptions({
	defaultValues: {
		email: "",
		password: "",
		description: "",
		gender: "male",
		roles: ["user"],
		tasks: "task1",
		isEnabled: false,
		subordinates: [
			{
				email: "",
				password: "",
				description: "",
				gender: "male",
				roles: ["user"],
				tasks: "task1",
				isEnabled: false,
			},
		],
	},
	validators: {
		onBlur: formSchema,
		onSubmit: formSchema,
	},
});
