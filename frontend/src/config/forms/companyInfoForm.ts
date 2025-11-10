import type { FormConfig } from "../../lib/form";

export const companyInfoFormConfig: FormConfig = {
	companyName: {
		label: "forms.labels.companyName",
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
	phone: {
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
		placeholder: "forms.placeholders.companyEmail",
	},
	website: {
		label: "forms.labels.website",
		type: "text",
		defaultValue: "",
		validation: {
			required: false,
		},
		placeholder: "forms.placeholders.websiteUrl",
	},
	logoUrl: {
		label: "forms.labels.logoUrl",
		type: "text",
		defaultValue: "",
		validation: {
			required: false,
		},
		placeholder: "forms.placeholders.logoUrl",
	},
	taxNumber: {
		label: "forms.labels.taxNumber",
		type: "text",
		defaultValue: "",
		validation: {
			required: false,
		},
	},
	registrationNumber: {
		label: "forms.labels.registrationNumber",
		type: "text",
		defaultValue: "",
		validation: {
			required: false,
		},
	},
};
