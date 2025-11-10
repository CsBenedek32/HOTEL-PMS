import { InputAdornment, TextField as MuiTextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { FieldConfig, FieldValue } from "../types";

interface TextFieldProps {
	fieldName: string;
	config: FieldConfig;
	value: FieldValue;
	error?: string;
	touched?: boolean;
	onChange: (value: FieldValue) => void;
}

export const TextField = ({
	fieldName,
	config,
	value,
	error,
	touched,
	onChange,
}: TextFieldProps) => {
	const showError = touched && !!error;
	const { t } = useTranslation();
	const {
		type,
		label,
		defaultValue,
		validation,
		options,
		prefix,
		suffix,
		...textFieldProps
	} = config;

	const InputProps: {
		startAdornment?: React.ReactElement;
		endAdornment?: React.ReactElement;
	} = {};
	if (prefix) {
		InputProps.startAdornment = (
			<InputAdornment position="start">{prefix}</InputAdornment>
		);
	}
	if (suffix) {
		InputProps.endAdornment = (
			<InputAdornment position="end">{suffix}</InputAdornment>
		);
	}

	const isNumber = config.type === "number";

	return (
		<MuiTextField
			key={fieldName}
			{...textFieldProps}
			type={isNumber ? "number" : "text"}
			label={config.label ? t(config.label) : ""}
			value={value ?? ""}
			onChange={(e) => {
				const newValue = isNumber ? Number(e.target.value) : e.target.value;
				onChange(newValue);
			}}
			error={showError}
			helperText={
				showError ? error : config.helperText ? t(config.helperText) : ""
			}
			placeholder={config.placeholder ? t(config.placeholder) : ""}
			disabled={config.disabled}
			fullWidth
			margin="normal"
			slotProps={{
				input: Object.keys(InputProps).length > 0 ? InputProps : undefined,
			}}
		/>
	);
};
