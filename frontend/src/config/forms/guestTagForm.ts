import type { FormConfig } from "../../lib/form";

export const guestTagFormConfig: FormConfig = {
	tagName: {
		label: "forms.labels.tagName",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			minLength: 2,
		},
	},
	active: {
		label: "forms.labels.active",
		type: "checkbox",
		defaultValue: true,
		validation: {
			required: false,
		},
	},
};
