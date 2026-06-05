import { useStore } from "@tanstack/react-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { useFieldContext } from "@/routes/demo/form-demo/form-provider";

export default function CheckboxInput({
	label,
	description,
	options,
}: {
	label?: string;
	description?: string;
	options: { value: string; label: string }[];
}) {
	const field = useFieldContext<string[]>();
	const state = useStore(field.store, (state) => state);
	const isInvalid = state.meta.isTouched && !state.meta.isValid;
	return (
		<FieldSet>
			{label && <FieldLegend variant="label">{label}</FieldLegend>}
			{description && <FieldDescription>{description}</FieldDescription>}
			<FieldGroup data-slot="checkbox-group">
				{options.map((item) => {
					return (
						<Field
							key={item.value}
							orientation="horizontal"
							data-invalid={isInvalid}
						>
							<Checkbox
								key={`checkbox-item-${item.value}`}
								id={`checkbox-item-${item.value}`}
								name={field.name}
								aria-invalid={isInvalid}
								checked={state.value.includes(item.value)}
								onCheckedChange={(checked) => {
									if (checked) {
										field.pushValue(item.value);
									} else {
										const index = state.value.indexOf(item.value);
										if (index > -1) {
											field.removeValue(index);
										}
									}
								}}
							/>
							<FieldLabel htmlFor={`checkbox-item-${item.value}`}>
								{item.label}
							</FieldLabel>
						</Field>
					);
				})}
			</FieldGroup>
			{isInvalid && <FieldError errors={state.meta.errors} />}
		</FieldSet>
	);
}
