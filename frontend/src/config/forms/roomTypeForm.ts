import type { FormConfig } from "../../lib/form";

export const roomTypeFormConfig: FormConfig = {
	typeName: {
		label: "forms.labels.roomTypeName",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			minLength: 2,
		},
	},
	price: {
		label: "forms.labels.price",
		type: "number",
		defaultValue: 0,
		validation: {
			required: true,
			min: 0,
		},
	},
	capacity: {
		label: "forms.labels.capacity",
		type: "number",
		defaultValue: 1,
		validation: {
			required: true,
			min: 1,
		},
	},
};
