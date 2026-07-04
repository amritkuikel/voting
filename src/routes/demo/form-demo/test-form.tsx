import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/routes/demo/form-demo/form-hook";
import { PartialForm } from "@/routes/demo/form-demo/partial-form";
import { testFormOptions } from "./options";
export default function TestForm() {
	const form = useAppForm({
		...testFormOptions,
		onSubmit: async ({ value }) => {
			console.log(value);
		},
	});
	return (
		<Card className="w-full">
			<form
				id="test-form"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit(e);
				}}
			>
				<CardContent>
					<FieldGroup>
						<PartialForm form={form} />

						<form.AppField
							name="subordinates"
							mode="array"
							children={(field) => (
								<field.SubordinatesInput
									label="Subordinates"
									description="Add subordinates to the user."
									form={form}
								/>
							)}
						/>
					</FieldGroup>
				</CardContent>
				<CardFooter>
					<form.AppForm>
						<form.SubscribeButtons />
					</form.AppForm>
				</CardFooter>
			</form>
		</Card>
	);
}
