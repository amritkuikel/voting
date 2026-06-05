/** biome-ignore-all lint/correctness/noChildrenProp: <todo> */
import { withForm } from "@/routes/demo/form-demo/form-hook";
import { testFormOptions } from "./options";

export const PartialForm = withForm({
	...testFormOptions,
	render: ({ form }) => {
		return (
			<div>
				<h1>Partial Form</h1>
				<form.AppField
					name="email"
					children={(field) => (
						<field.TextInput
							label="email"
							type="email"
							placeholder="Enter your email"
						/>
					)}
				/>
				<form.AppField
					name="password"
					children={(field) => (
						<field.TextInput
							label="password"
							type="password"
							placeholder="Enter your password"
						/>
					)}
				/>
				<form.AppField
					name="description"
					children={(field) => (
						<field.TextAreaInput
							label="description"
							placeholder="Enter your description"
						/>
					)}
				/>
				<form.AppField
					name="gender"
					children={(field) => (
						<field.SelectInput
							label="gender"
							options={[
								{ value: "male", label: "Male" },
								{ value: "female", label: "Female" },
							]}
						/>
					)}
				/>
				<form.AppField
					name="roles"
					children={(field) => (
						<field.CheckboxInput
							label="roles"
							options={[
								{ value: "admin", label: "Admin" },
								{ value: "user", label: "User" },
							]}
						/>
					)}
				/>
				<form.AppField
					name="tasks"
					children={(field) => (
						<field.RadioInput
							label="tasks"
							options={[
								{ value: "task1", label: "Task 1" },
								{ value: "task2", label: "Task 2" },
								{ value: "task3", label: "Task 3" },
							]}
						/>
					)}
				/>
				<form.AppField
					name="isEnabled"
					children={(field) => <field.SwitchInput label="isEnabled" />}
				/>
			</div>
		);
	},
});