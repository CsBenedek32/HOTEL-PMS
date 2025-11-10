import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useTranslation } from "react-i18next";
import type { FieldConfig, FieldValue } from "../types";

interface DatePickerFieldProps {
	fieldName: string;
	config: FieldConfig;
	value: FieldValue;
	error?: string;
	touched?: boolean;
	onChange: (value: FieldValue) => void;
}

export const DatePickerField = ({
	config,
	value,
	error,
	touched,
	onChange,
}: DatePickerFieldProps) => {
	const showError = touched && !!error;
	const { t } = useTranslation();
	const {
		type,
		label,
		defaultValue,
		validation,
		options,
		canBeFutureDate = true,
		canBePastDate = true,
		...datePickerProps
	} = config;

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<DatePicker
				{...datePickerProps}
				label={t(config.label)}
				format={config.dateFormat || "yyyy-MM-dd"}
				value={(value instanceof Date ? value : null) as Date | null}
				onChange={(newValue) => onChange(newValue as FieldValue)}
				disabled={config.disabled}
				slotProps={{
					textField: {
						fullWidth: true,
						margin: "normal",
						error: showError,
						helperText: showError ? error : t(config.helperText || ""),
						placeholder: t(config.placeholder || ""),
					},
				}}
				disablePast={!canBePastDate}
				disableFuture={!canBeFutureDate}
			/>
		</LocalizationProvider>
	);
};
