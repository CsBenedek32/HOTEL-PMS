import type { FormConfig } from "../../lib/form";

export const serviceFormConfig: FormConfig = {
	name: {
		label: "forms.labels.serviceName",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			minLength: 2,
		},
		placeholder: "forms.placeholders.serviceName",
	},
	description: {
		label: "forms.labels.description",
		type: "text",
		defaultValue: "",
		validation: {
			required: false,
		},
		placeholder: "forms.placeholders.serviceDescription",
	},
	cost: {
		label: "forms.labels.cost",
		type: "number",
		defaultValue: 0,
		validation: {
			required: true,
			min: 0,
		},
		placeholder: "forms.placeholders.decimalNumber",
	},
	vatId: {
		label: "forms.labels.vat",
		type: "select",
		defaultValue: "",
		validation: {
			required: true,
		},
		options: [],
	},
};
