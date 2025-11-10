import { GuestType } from "../../interfaces/enums";
import type { FormConfig } from "../../lib/form";

export const guestFormConfig: FormConfig = {
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
	email: {
		label: "forms.labels.email",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		},
		placeholder: "forms.placeholders.guestEmail",
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
	type: {
		label: "forms.labels.guestType",
		type: "select",
		defaultValue: GuestType.ADULT,
		validation: {
			required: true,
		},
		options: [
			{ value: GuestType.ADULT, label: "forms.options.adult" },
			{ value: GuestType.CHILD, label: "forms.options.child" },
		],
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
