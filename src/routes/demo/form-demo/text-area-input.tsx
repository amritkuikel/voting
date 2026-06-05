import { useStore } from "@tanstack/react-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useFieldContext } from "@/routes/demo/form-demo/form-provider";

export default function TextAreaInput({
	label,
	placeholder,
}: {
	label: string;
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
			<FieldLabel>{label}</FieldLabel>
			<Textarea
				id={field.name}
				name={field.name}
				value={value}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
				aria-invalid={isInvalid}
				placeholder={placeholder}
				autoComplete="off"
			/>
			{isInvalid && <FieldError errors={errors} />}
		</Field>
	);
}
