import { Autocomplete, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { FieldConfig, FieldOption, FieldValue } from "../types";

interface AutocompleteFieldProps {
	fieldName: string;
	config: FieldConfig;
	value: FieldValue;
	error?: string;
	touched?: boolean;
	onChange: (value: FieldValue) => void;
}

export const AutocompleteField = ({
	fieldName,
	config,
	value,
	error,
	touched,
	onChange,
}: AutocompleteFieldProps) => {
	const { t } = useTranslation();
	const showError = touched && !!error;
	const { type, label, defaultValue, validation, ...autocompleteProps } =
		config;

	return (
		<Autocomplete
			key={fieldName}
			{...autocompleteProps}
			options={config.options || []}
			value={
				(value || (config.multiple ? [] : null)) as
					| FieldOption
					| FieldOption[]
					| null
			}
			onChange={(_, newValue) => onChange(newValue as FieldValue)}
			multiple={config.multiple}
			disabled={config.disabled}
			getOptionLabel={(option) => (option as FieldOption)?.label || ""}
			isOptionEqualToValue={(option, val) =>
				(option as FieldOption)?.value === (val as FieldOption)?.value
			}
			renderInput={(params) => (
				<TextField
					{...params}
					label={config.label ? t(config.label) : ""}
					error={showError}
					helperText={
						showError ? error : config.helperText ? t(config.helperText) : ""
					}
					placeholder={config.placeholder ? t(config.placeholder) : ""}
				/>
			)}
			fullWidth
			sx={{ mt: 2, mb: 1 }}
		/>
	);
};
