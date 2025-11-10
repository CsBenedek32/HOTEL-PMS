import type { FormConfig } from "../../lib/form";

export const buildingFormConfig: FormConfig = {
	name: {
		label: "forms.labels.buildingName",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			minLength: 2,
		},
	},
	address: {
		label: "forms.labels.address",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			minLength: 5,
		},
	},
	city: {
		label: "forms.labels.city",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			minLength: 2,
		},
	},
	zipcode: {
		label: "forms.labels.zipCode",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			minLength: 3,
		},
	},
	country: {
		label: "forms.labels.country",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			minLength: 2,
		},
	},
	phoneNumber: {
		label: "forms.labels.phoneNumber",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			pattern: /^[\d\s\-+()]+$/,
		},
		placeholder: "forms.placeholders.phoneExample",
	},
	email: {
		label: "forms.labels.email",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		},
		placeholder: "forms.placeholders.buildingEmail",
	},
	description: {
		label: "forms.labels.description",
		type: "text",
		defaultValue: "",
		validation: {
			required: false,
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
