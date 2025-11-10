import { RoomStatus } from "../../interfaces/enums";
import type { FormConfig } from "../../lib/form";

export const roomFormConfig: FormConfig = {
	roomNumber: {
		label: "forms.labels.roomNumber",
		type: "text",
		defaultValue: "",
		validation: {
			required: true,
			minLength: 1,
		},
		placeholder: "forms.placeholders.roomNumber",
	},
	floorNumber: {
		label: "forms.labels.floorNumber",
		type: "number",
		defaultValue: 0,
		validation: {
			required: true,
			min: 0,
		},
	},
	status: {
		label: "forms.labels.status",
		type: "select",
		defaultValue: RoomStatus.CLEAN,
		validation: {
			required: true,
		},
		options: [
			{ value: RoomStatus.CLEAN, label: "forms.options.clean" },
			{ value: RoomStatus.DIRTY, label: "forms.options.dirty" },
			{ value: RoomStatus.OUT_OF_SERVICE, label: "forms.options.outOfService" },
		],
	},
	roomTypeId: {
		label: "forms.labels.roomType",
		type: "select",
		defaultValue: "",
		validation: {
			required: true,
		},
		options: [],
	},
	buildingId: {
		label: "forms.labels.building",
		type: "select",
		defaultValue: "",
		validation: {
			required: true,
		},
		options: [],
	},
	description: {
		label: "forms.labels.description",
		type: "text",
		defaultValue: "",
		validation: {
			required: false,
		},
		placeholder: "forms.placeholders.roomDescription",
	},
};
