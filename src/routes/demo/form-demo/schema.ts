import z from "zod";

export const formSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters."),
	description: z.string().min(10),
	gender: z.enum(["male", "female"]),
	roles: z.array(z.enum(["admin", "user"])),
	tasks: z.enum(["task1", "task2", "task3"]),
	isEnabled: z.boolean(),
	subordinates: z.array(
		z.object({
			email: z.string().email("Invalid email address"),
			password: z.string().min(8, "Password must be at least 8 characters."),
			description: z.string().min(10),
			gender: z.enum(["male", "female"]),
			roles: z.array(z.enum(["admin", "user"])),
			tasks: z.enum(["task1", "task2", "task3"]),
			isEnabled: z.boolean(),
		}),
	),
});
