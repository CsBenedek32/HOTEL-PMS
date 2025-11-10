import type { FormConfig } from "../../lib/form";

export const bookingBaseDataFormConfig: FormConfig = {
	name: {
		label: "booking.name",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			minLength: 2,
		},
		placeholder: "booking.namePlaceholder",
	},
	checkInDate: {
		label: "booking.checkInDate",
		type: "datepicker",
		canBeFutureDate: true,
		canBePastDate: false,
		validation: {
			required: true,
		},
		dateFormat: "yyyy-MM-dd",
	},
	checkOutDate: {
		label: "booking.checkOutDate",
		type: "datepicker",
		canBeFutureDate: true,
		canBePastDate: false,
		validation: {
			required: true,
		},
		dateFormat: "yyyy-MM-dd",
	},
	description: {
		label: "booking.description",
		type: "text",
		defaultValue: "",
		validation: {
			required: false,
		},
		placeholder: "booking.descriptionPlaceholder",
	},
};

export const bookingGuestsFormConfig: FormConfig = {
	guestIds: {
		label: "booking.guests",
		type: "text",
		defaultValue: [],
		validation: {
			required: false,
		},
	},
};

export const bookingRoomsFormConfig: FormConfig = {};
