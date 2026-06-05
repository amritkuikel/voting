import { useStore } from "@tanstack/react-form";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useFieldContext } from "@/routes/demo/form-demo/form-provider";

export default function SelectInput({
	label,
	description,
	placeholder,
	options,
}: {
	label: string;
	description?: string;
	placeholder?: string;
	options: { value: string; label: string }[];
}) {
	const field = useFieldContext<string>();
	const value = useStore(field.store, (state) => state.value);
	const errors = useStore(field.store, (state) => state.meta.errors);
	const isTouched = useStore(field.store, (state) => state.meta.isTouched);
	const isValid = useStore(field.store, (state) => state.meta.isValid);
	const isInvalid = isTouched && !isValid;
	return (
		<Field data-invalid={isInvalid}>
			<FieldContent>
				<FieldLabel>{label}</FieldLabel>
				{description && <FieldDescription>{description}</FieldDescription>}
				{isInvalid && <FieldError errors={errors} />}
			</FieldContent>
			<Select
				name={field.name}
				value={value}
				onValueChange={field.handleChange}
			>
				<SelectTrigger id={field.name} aria-invalid={isInvalid}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent position="item-aligned">
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{isInvalid && <FieldError errors={errors} />}
		</Field>
	);
}
