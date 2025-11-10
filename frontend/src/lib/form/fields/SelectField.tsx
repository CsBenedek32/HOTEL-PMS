import {
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { FieldConfig, FieldValue } from "../types";

interface SelectFieldProps {
	fieldName: string;
	config: FieldConfig;
	value: FieldValue;
	error?: string;
	touched?: boolean;
	onChange: (value: FieldValue) => void;
}

export const SelectField = ({
	fieldName,
	config,
	value,
	error,
	touched,
	onChange,
}: SelectFieldProps) => {
	const { t } = useTranslation();
	const showError = touched && !!error;
	const {
		type,
		label,
		defaultValue,
		validation,
		options,
		disabled,
		multiple,
		helperText,
		...selectProps
	} = config;

	return (
		<FormControl
			key={fieldName}
			fullWidth
			margin="normal"
			error={showError}
			disabled={disabled}
		>
			<InputLabel>{label ? t(label) : ""}</InputLabel>
			<Select
				{...selectProps}
				value={value || (multiple ? [] : "")}
				onChange={(e) => onChange(e.target.value)}
				label={label ? t(label) : ""}
				multiple={multiple}
			>
				{!options || options.length === 0 ? (
					<MenuItem disabled value="">
						{t("common.notAvailable")}
					</MenuItem>
				) : (
					options.map((option) => (
						<MenuItem key={option.value} value={option.value}>
							{t(option.label)}
						</MenuItem>
					))
				)}
			</Select>
			{(showError || helperText) && (
				<FormHelperText>
					{showError ? error : helperText ? t(helperText) : ""}
				</FormHelperText>
			)}
		</FormControl>
	);
};
