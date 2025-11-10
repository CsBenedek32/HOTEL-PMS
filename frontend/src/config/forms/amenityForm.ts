import type { FormConfig } from "../../lib/form";

export const amenityFormConfig: FormConfig = {
	amenityName: {
		label: "forms.labels.amenityName",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			minLength: 2,
		},
	},
};
