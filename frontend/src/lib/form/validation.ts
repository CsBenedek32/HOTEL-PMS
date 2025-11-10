import type {
	FieldConfig,
	FieldValue,
	FormErrors,
	FormValues,
	ValidationRules,
} from "./types";

export const validateField = (
	value: FieldValue,
	validation?: ValidationRules,
): string | undefined => {
	if (!validation) return undefined;

	if (validation.required) {
		const isEmpty =
			value === undefined ||
			value === null ||
			value === "" ||
			(Array.isArray(value) && value.length === 0);

		if (isEmpty) {
			return typeof validation.required === "string"
				? validation.required
				: "This field is required";
		}
	}

	if (value === undefined || value === null || value === "") {
		return undefined;
	}

	if (typeof value === "number") {
		if (validation.min !== undefined && value < validation.min) {
			return `Minimum value is ${validation.min}`;
		}
		if (validation.max !== undefined && value > validation.max) {
			return `Maximum value is ${validation.max}`;
		}
	}

	if (typeof value === "string") {
		if (
			validation.minLength !== undefined &&
			value.length < validation.minLength
		) {
			return `Minimum length is ${validation.minLength} characters`;
		}
		if (
			validation.maxLength !== undefined &&
			value.length > validation.maxLength
		) {
			return `Maximum length is ${validation.maxLength} characters`;
		}
	}

	if (validation.pattern && typeof value === "string") {
		if (!validation.pattern.test(value)) {
			return "Invalid format";
		}
	}

	if (validation.custom) {
		return validation.custom(value);
	}

	return undefined;
};

export const validateForm = (
	values: FormValues,
	config: { [fieldName: string]: FieldConfig },
): FormErrors => {
	const errors: FormErrors = {};

	Object.keys(config).forEach((fieldName) => {
		const fieldConfig = config[fieldName];
		const value = values[fieldName];
		const error = validateField(value, fieldConfig.validation);

		if (error) {
			errors[fieldName] = error;
		}
	});

	return errors;
};

export const hasErrors = (errors: FormErrors): boolean => {
	return Object.values(errors).some((error) => error !== undefined);
};
