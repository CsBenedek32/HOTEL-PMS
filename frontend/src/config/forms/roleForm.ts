import type { FormConfig } from "../../lib/form";

export const roleFormConfig: FormConfig = {
	name: {
		label: "forms.labels.roleName",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			minLength: 2,
		},
	},
};
