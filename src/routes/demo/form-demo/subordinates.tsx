import { useStore } from "@tanstack/react-form";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { useFieldContext } from "@/routes/demo/form-demo/form-provider";
import { PartialReusableForm } from "@/routes/demo/form-demo/partial-reusable-form";

export default function SubordinatesInput({
	label,
	description,
	form,
}: {
	label?: string;
	description?: string;
	form?: any;
}) {
	const field =
		useFieldContext<
			{
				email: string;
				password: string;
				description: string;
				gender: "male" | "female";
				roles: string[];
				tasks: string;
				isEnabled: boolean;
			}[]
		>();
	const store = useStore(field.store, (state) => state);
	const isInvalid = store.meta.isTouched && !store.meta.isValid;
	return (
		<FieldSet data-invalid={isInvalid}>
			{label && <FieldLegend variant="label">{label}</FieldLegend>}
			{description && <FieldDescription>{description}</FieldDescription>}
			<FieldGroup>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() =>
						field.pushValue({
							email: "",
							password: "",
							description: "",
							gender: "male",
							roles: ["user"],
							tasks: "task1",
							isEnabled: false,
						})
					}
					disabled={field.state.value.length >= 5}
				>
					Add Subordinate
				</Button>
				{field.state.value.map((a, index) => (
					<Card key={a.email} className="p-2">
						<PartialReusableForm
							form={form}
							fields={
								{
									email: `subordinates[${index}].email`,
									password: `subordinates[${index}].password`,
									description: `subordinates[${index}].description`,
									gender: `subordinates[${index}].gender`,
									roles: `subordinates[${index}].roles`,
									tasks: `subordinates[${index}].tasks`,
									isEnabled: `subordinates[${index}].isEnabled`,
								} as any
							}
						/>

						<Button type="button" onClick={() => field.removeValue(index)}>
							<XIcon /> Remove Subordinate
						</Button>
					</Card>
				))}
			</FieldGroup>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</FieldSet>
	);
}
