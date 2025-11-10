import type { FieldConfig, FieldValue } from "./types";

export const getDefaultValueForType = (config: FieldConfig): FieldValue => {
	switch (config.type) {
		case "checkbox":
			return false;
		case "autocomplete":
		case "select":
			return config.multiple ? [] : null;
		case "datepicker":
			return null;
		case "number":
			return 0;
		case "bedTypeQuantity":
			return [];
		default:
			return "";
	}
};
