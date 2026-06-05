import { withFieldGroup } from "@/routes/demo/form-demo/form-hook";

export const PartialReusableForm = withFieldGroup({
	defaultValues: {
		email: "",
		password: "",
		description: "",
		gender: "male",
		roles: ["user"],
		tasks: "task1",
		isEnabled: false,
	},
	render: function Render({ group }) {
		return (
			<div>
				<h1>Partial Reusable Form</h1>
				<group.AppField
					name="email"
					children={(field) => <field.TextInput label="Email" type="email" />}
				/>
				<group.AppField
					name="password"
					children={(field) => (
						<field.TextInput label="Password" type="password" />
					)}
				/>
				<group.AppField
					name="description"
					children={(field) => <field.TextAreaInput label="Description" />}
				/>
				<group.AppField
					name="gender"
					children={(field) => (
						<field.SelectInput
							label="Gender"
							options={[
								{ value: "male", label: "Male" },
								{ value: "female", label: "Female" },
							]}
						/>
					)}
				/>
				<group.AppField
					name="roles"
					children={(field) => (
						<field.CheckboxInput
							label="Roles"
							options={[
								{ value: "user", label: "User" },
								{ value: "admin", label: "Admin" },
							]}
						/>
					)}
				/>
				<group.AppField
					name="tasks"
					children={(field) => (
						<field.SelectInput
							label="Tasks"
							options={[
								{ value: "task1", label: "Task 1" },
								{ value: "task2", label: "Task 2" },
								{ value: "task3", label: "Task 3" },
							]}
						/>
					)}
				/>
				<group.AppField
					name="isEnabled"
					children={(field) => <field.SwitchInput label="Is Enabled" />}
				/>
			</div>
		);
	},
});