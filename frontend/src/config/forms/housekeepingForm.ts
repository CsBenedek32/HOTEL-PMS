import { HousekeepingPriority } from "../../interfaces/enums";
import type { FormConfig } from "../../lib/form";

export const housekeepingFormConfig: FormConfig = {
	roomId: {
		label: "forms.labels.room",
		type: "select",
		defaultValue: "",
		validation: {
			required: true,
		},
		options: [],
	},
	userId: {
		label: "forms.labels.assignedTo",
		type: "select",
		defaultValue: "",
		validation: {
			required: false,
		},
		options: [],
	},
	priority: {
		label: "forms.labels.priority",
		type: "select",
		defaultValue: HousekeepingPriority.LOW,
		validation: {
			required: true,
		},
		options: [
			{ value: HousekeepingPriority.LOW, label: "forms.options.low" },
			{ value: HousekeepingPriority.MEDIUM, label: "forms.options.medium" },
			{ value: HousekeepingPriority.HIGH, label: "forms.options.high" },
			{ value: HousekeepingPriority.URGENT, label: "forms.options.urgent" },
		],
	},
	note: {
		label: "housekeeping.note",
		type: "text",
		defaultValue: "",
		validation: {
			required: false,
		},
		placeholder: "housekeeping.notePlaceholder",
	},
};
