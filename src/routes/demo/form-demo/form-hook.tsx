import { createFormHook } from "@tanstack/react-form";
import { lazy } from "react";
import { Button } from "@/components/ui/button";
import { fieldContext, formContext, useFormContext } from "./form-provider";

const TextInput = lazy(() => import("@/routes/demo/form-demo/text-input"));
const TextAreaInput = lazy(
	() => import("@/routes/demo/form-demo/text-area-input"),
);
const SelectInput = lazy(
	() => import("@/routes/demo/form-demo/select-input"),
);
const CheckboxInput = lazy(
	() => import("@/routes/demo/form-demo/checkbox-input"),
);
const RadioInput = lazy(
	() => import("@/routes/demo/form-demo/radio-input"),
);
const SwitchInput = lazy(
	() => import("@/routes/demo/form-demo/switch-input"),
);
const SubordinatesInput = lazy(
	() => import("@/routes/demo/form-demo/subordinates"),
);

function SubscribeButtons() {
	const form = useFormContext();
	return (
		<form.Subscribe
			selector={(state) => ({
				isSubmitting: state.isSubmitting,
				isValid: state.isValid,
				isDirty: state.isDirty,
			})}
		>
			{({ isSubmitting, isValid, isDirty }) => (
				<div className="flex gap-2">
					<Button type="submit" disabled={isSubmitting || !isValid}>
						{isSubmitting ? "Submitting..." : "Submit"}
					</Button>

					<Button
						type="button"
						variant="outline"
						disabled={isSubmitting || !isDirty}
						onClick={() => form.reset()}
					>
						Reset
					</Button>
				</div>
			)}
		</form.Subscribe>
	);
}

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
	fieldComponents: {
		TextInput,
		TextAreaInput,
		SelectInput,
		CheckboxInput,
		RadioInput,
		SwitchInput,
		SubordinatesInput,
	},
	formComponents: {
		SubscribeButtons,
	},

	fieldContext,
	formContext,
});