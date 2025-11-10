import type { FormConfig } from "../../lib/form";

export const userFormConfig: FormConfig = {
	firstName: {
		label: "forms.labels.firstName",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			minLength: 2,
		},
	},
	lastName: {
		label: "forms.labels.lastName",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			minLength: 2,
		},
	},
	phone: {
		label: "forms.labels.phone",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			minLength: 5,
		},
	},
	email: {
		label: "forms.labels.email",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		},
	},
	password: {
		label: "forms.labels.password",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			minLength: 6,
		},
	},
};
