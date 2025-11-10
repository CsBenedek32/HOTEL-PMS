import type { FormConfig } from "../../lib/form";

export const invoiceBaseDataFormConfig: FormConfig = {
	name: {
		label: "invoice.name",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			minLength: 2,
		},
	},
	description: {
		label: "invoice.description",
		type: "text",
		defaultValue: "",
		validation: {
			required: false,
		},
	},
	paymentStatus: {
		label: "invoice.paymentStatus",
		type: "select",
		defaultValue: "",
		validation: {
			required: true,
		},
		options: [
			{ value: "PENDING", label: "forms.options.pending" },
			{ value: "FULFILLED", label: "forms.options.fulfilled" },
			{ value: "CANCELLED", label: "forms.options.cancelled" },
		],
	},
	totalSum: {
		label: "invoice.totalSum",
		type: "text",
		defaultValue: "",
		disabled: true,
		validation: {
			required: false,
		},
	},
};

export const invoiceRecipientDataFormConfig: FormConfig = {
	recipientName: {
		label: "invoice.recipientName",
		type: "text",
		defaultValue: "",
		validation: {
			required: false,
		},
	},
	recipientCompanyName: {
		label: "invoice.recipientCompanyName",
		type: "text",
		defaultValue: "",
		validation: {
			required: false,
		},
	},
	recipientEmail: {
		label: "invoice.recipientEmail",
		type: "text",
		defaultValue: "",
		validation: {
			required: false,
			pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		},
		placeholder: "forms.placeholders.recipientEmail",
	},
	recipientPhone: {
		label: "invoice.recipientPhone",
		type: "text",
		defaultValue: "",
		validation: {
			required: false,
			pattern: /^[\d\s\-+()]+$/,
		},
		placeholder: "forms.placeholders.phoneExample",
	},
	recipientAddress: {
		label: "invoice.recipientAddress",
		type: "text",
		defaultValue: "",
		validation: {
			required: false,
		},
	},
	recipientCity: {
		label: "invoice.recipientCity",
		type: "text",
		defaultValue: "",
		validation: {
			required: false,
		},
	},
	recipientPostalCode: {
		label: "invoice.recipientPostalCode",
		type: "text",
		defaultValue: "",
		validation: {
			required: false,
		},
	},
	recipientCountry: {
		label: "invoice.recipientCountry",
		type: "text",
		defaultValue: "",
		validation: {
			required: false,
		},
	},
	recipientTaxNumber: {
		label: "invoice.recipientTaxNumber",
		type: "text",
		defaultValue: "",
		validation: {
			required: false,
		},
	},
};

export const invoiceCreateFormConfig: FormConfig = {
	name: {
		label: "invoice.name",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			minLength: 2,
		},
	},
};
