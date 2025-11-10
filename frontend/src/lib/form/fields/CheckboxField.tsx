import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormHelperText,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { FieldConfig, FieldValue } from "../types";

interface CheckboxFieldProps {
	fieldName: string;
	config: FieldConfig;
	value: FieldValue;
	error?: string;
	touched?: boolean;
	onChange: (value: FieldValue) => void;
}

export const CheckboxField = ({
	fieldName,
	config,
	value,
	error,
	touched,
	onChange,
}: CheckboxFieldProps) => {
	const { t } = useTranslation();
	const showError = touched && !!error;

	const { type, label, defaultValue, validation, options, ...checkboxProps } =
		config;

	return (
		<FormControl key={fieldName} fullWidth margin="normal" error={showError}>
			<FormControlLabel
				control={
					<Checkbox
						checked={!!value}
						onChange={(e) => onChange(e.target.checked)}
						disabled={config.disabled}
						{...checkboxProps}
					/>
				}
				label={config.label ? t(config.label) : ""}
			/>
			{(showError || config.helperText) && (
				<FormHelperText>
					{showError ? error : config.helperText ? t(config.helperText) : ""}
				</FormHelperText>
			)}
		</FormControl>
	);
};
