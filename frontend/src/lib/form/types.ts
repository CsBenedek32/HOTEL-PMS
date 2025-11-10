export type FieldType =
	| "text"
	| "number"
	| "autocomplete"
	| "select"
	| "checkbox"
	| "datepicker"
	| "bedTypeQuantity";

export type FieldValue =
	| string
	| number
	| boolean
	| Date
	| null
	| FieldOption
	| FieldOption[]
	| unknown[]
	| unknown;

export interface FieldOption {
	label: string;
	value: string | number;
}

export interface ValidationRules {
	required?: boolean | string;
	min?: number;
	max?: number;
	minLength?: number;
	maxLength?: number;
	pattern?: RegExp;
	custom?: (value: FieldValue) => string | undefined;
}

export interface FieldConfig {
	label: string;
	type: FieldType;
	defaultValue?: FieldValue;
	validation?: ValidationRules;
	options?: FieldOption[];
	placeholder?: string;
	helperText?: string;
	disabled?: boolean;
	multiple?: boolean;
	prefix?: string;
	suffix?: string;
	canBePastDate?: boolean;
	canBeFutureDate?: boolean;
	dateFormat?: string;
	[key: string]: unknown;
}

export interface FormConfig {
	[fieldName: string]: FieldConfig;
}

export interface FormValues {
	[fieldName: string]: FieldValue;
}

export interface FormErrors {
	[fieldName: string]: string | undefined;
}

export interface FormState {
	values: FormValues;
	errors: FormErrors;
	touched: { [fieldName: string]: boolean };
}

export interface ButtonConfig {
	save?: boolean;
	cancel?: boolean;
}
