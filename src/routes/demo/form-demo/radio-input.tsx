import { useStore } from "@tanstack/react-form";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
	FieldLegend,
	FieldSet,
	FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFieldContext } from "@/routes/demo/form-demo/form-provider";

export default function RadioInput({
	label,
	description,
	options,
}: {
	label?: string;
	description?: string;
	options: { value: string; label?: string; description?: string }[];
}) {
	const field = useFieldContext<string>();
	const store = useStore(field.store, (state) => state);
	const isInvalid = store.meta.isTouched && !store.meta.isValid;
	return (
		<FieldSet>
			{label && <FieldLegend variant="label">{label}</FieldLegend>}
			{description && <FieldDescription>{description}</FieldDescription>}
			<RadioGroup
				name={field.name}
				value={store.value}
				onValueChange={field.handleChange}
			>
				{options.map((option) => (
					<FieldLabel
						key={option.value}
						htmlFor={`form-tanstack-radiogroup-${option.value}`}
					>
						<Field orientation="horizontal" data-invalid={isInvalid}>
							<FieldContent>
								{option.label && <FieldTitle>{option.label}</FieldTitle>}
								{option.description && (
									<FieldDescription>{option.description}</FieldDescription>
								)}
							</FieldContent>
							<RadioGroupItem
								value={option.value}
								id={`form-tanstack-radiogroup-${option.value}`}
								aria-invalid={isInvalid}
							/>
						</Field>
					</FieldLabel>
				))}
			</RadioGroup>
		</FieldSet>
	);
}
