import type { FormConfig } from "../../lib/form";

export const bedTypeFormConfig: FormConfig = {
	bedTypeName: {
		label: "forms.labels.bedTypeName",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			minLength: 2,
		},
	},
};
