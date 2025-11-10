import React, { useState } from "react";
import { AutocompleteField } from "./fields/AutocompleteField";
import { BedTypeQuantityField } from "./fields/BedTypeQuantityField";
import { CheckboxField } from "./fields/CheckboxField";
import { DatePickerField } from "./fields/DatePickerField";
import { SelectField } from "./fields/SelectField";
import { TextField } from "./fields/TextField";
import type { FieldValue, FormConfig, FormErrors, FormValues } from "./types";
import { getDefaultValueForType } from "./utils";

interface FormFactoryProps {
	config: FormConfig;
	initialValues?: Partial<FormValues>;
	valuesRef: React.RefObject<FormValues>;
	errors?: FormErrors;
}

interface FieldWrapperProps {
	fieldName: string;
	fieldConfig: FormConfig[string];
	initialValue: FieldValue;
	valuesRef: React.RefObject<FormValues>;
	error?: string;
}

const FieldWrapper = React.memo(
	({
		fieldName,
		fieldConfig,
		initialValue,
		valuesRef,
		error,
	}: FieldWrapperProps) => {
		const [value, setValue] = useState<FieldValue>(initialValue);

		const handleChange = (newValue: FieldValue) => {
			setValue(newValue);
			if (valuesRef.current) {
				valuesRef.current[fieldName] = newValue;
			}
		};

		const fieldProps = {
			fieldName,
			config: fieldConfig,
			value,
			error,
			touched: true,
			onChange: handleChange,
		};

		switch (fieldConfig.type) {
			case "text":
			case "number":
				return <TextField {...fieldProps} />;

			case "autocomplete":
				return <AutocompleteField {...fieldProps} />;

			case "select":
				return <SelectField {...fieldProps} />;

			case "checkbox":
				return <CheckboxField {...fieldProps} />;

			case "datepicker":
				return <DatePickerField {...fieldProps} />;

			case "bedTypeQuantity":
				return <BedTypeQuantityField {...fieldProps} />;

			default:
				return null;
		}
	},
);

FieldWrapper.displayName = "FieldWrapper";

export const FormFactory = ({
	config,
	initialValues = {},
	valuesRef,
	errors = {},
}: FormFactoryProps) => {
	return (
		<>
			{Object.keys(config).map((fieldName) => {
				const fieldConfig = config[fieldName];
				const initialValue =
					initialValues[fieldName] ??
					fieldConfig.defaultValue ??
					getDefaultValueForType(fieldConfig);

				return (
					<FieldWrapper
						key={fieldName}
						fieldName={fieldName}
						fieldConfig={fieldConfig}
						initialValue={initialValue}
						valuesRef={valuesRef}
						error={errors[fieldName]}
					/>
				);
			})}
		</>
	);
};
