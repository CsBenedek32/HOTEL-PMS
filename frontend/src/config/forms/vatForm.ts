import type { FormConfig } from "../../lib/form";

export const vatFormConfig: FormConfig = {
	name: {
		label: "forms.labels.vatName",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			minLength: 2,
		},
	},
	percentage: {
		label: "forms.labels.percentage",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			pattern: /^\d+(\.\d{1,2})?$/,
			custom: (value) => {
				const num = Number.parseFloat(value as string);
				if (Number.isNaN(num)) return "Must be a valid number";
				if (num < 0 || num > 100) return "Must be between 0 and 100";
				return undefined;
			},
		},
		suffix: "%",
		placeholder: "forms.placeholders.decimalNumber",
	},
};
