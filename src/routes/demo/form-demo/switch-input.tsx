import { useStore } from "@tanstack/react-form";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { useFieldContext } from "@/routes/demo/form-demo/form-provider";

export default function SwitchInput({
	label,
	description,
}: {
	label?: string;
	description?: string;
}) {
	const field = useFieldContext<boolean>();
	const state = useStore(field.store, (state) => state);
	const isInvalid = state.meta.isTouched && !state.meta.isValid;
	return (
		<Field orientation="horizontal" data-invalid={isInvalid}>
			<FieldContent>
				{label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
				{description && <FieldDescription>{description}</FieldDescription>}
				{isInvalid && <FieldError errors={state.meta.errors} />}
			</FieldContent>
			<Switch
				id={field.name}
				name={field.name}
				checked={state.value}
				onCheckedChange={field.handleChange}
				aria-invalid={isInvalid}
			/>
		</Field>
	);
}
