import { useStore } from "@tanstack/react-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFieldContext } from "@/routes/demo/form-demo/form-provider";

export default function TextInput({
	label,
	type,
	placeholder,
}: {
	label: string;
	type: string;
	placeholder?: string;
}) {
	const field = useFieldContext<string>();

	const value = useStore(field.store, (state) => state.value);
	const errors = useStore(field.store, (state) => state.meta.errors);
	const isTouched = useStore(field.store, (state) => state.meta.isTouched);
	const isValid = useStore(field.store, (state) => state.meta.isValid);

	const isInvalid = isTouched && !isValid;

	return (
		<Field data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name}>{label}</FieldLabel>

			<Input
				value={value}
				type={type}
				placeholder={placeholder}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
				aria-invalid={isInvalid}
			/>

			{isInvalid && <FieldError errors={errors} />}
		</Field>
	);
}
