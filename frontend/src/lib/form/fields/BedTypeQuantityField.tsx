import { Add, Delete } from "@mui/icons-material";
import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	FormLabel,
	IconButton,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { BedTypeQuantity } from "../../../interfaces/roomType";
import type { FieldConfig, FieldOption, FieldValue } from "../types";

interface BedTypeQuantityFieldProps {
	fieldName: string;
	config: FieldConfig;
	value: FieldValue;
	error?: string;
	touched?: boolean;
	onChange: (value: FieldValue) => void;
}

export const BedTypeQuantityField = ({
	config,
	value,
	error,
	touched,
	onChange,
}: BedTypeQuantityFieldProps) => {
	const { t } = useTranslation();
	const showError = touched && !!error;
	const bedTypes = (value as BedTypeQuantity[]) || [];
	const bedTypeOptions = (config.options || []) as FieldOption[];

	const handleAdd = () => {
		const newBedTypes = [...bedTypes, { bedTypeId: 0, numBed: 1 }];
		onChange(newBedTypes);
	};

	const handleRemove = (index: number) => {
		const newBedTypes = bedTypes.filter((_, i) => i !== index);
		onChange(newBedTypes);
	};

	const handleBedTypeChange = (index: number, bedTypeId: number) => {
		const newBedTypes = [...bedTypes];
		newBedTypes[index] = { ...newBedTypes[index], bedTypeId };
		onChange(newBedTypes);
	};

	const handleQuantityChange = (index: number, numBed: number) => {
		const newBedTypes = [...bedTypes];
		newBedTypes[index] = { ...newBedTypes[index], numBed };
		onChange(newBedTypes);
	};

	return (
		<FormControl fullWidth margin="normal" error={showError}>
			<FormLabel>{config.label ? t(config.label) : ""}</FormLabel>
			<Box sx={{ mt: 1 }}>
				{bedTypes.map((bedType, index) => (
					<Box
						key={`bed-type-${bedType.bedTypeId}-${index}`}
						sx={{
							display: "flex",
							gap: 2,
							mb: 2,
							alignItems: "center",
						}}
					>
						<Select
							value={bedType.bedTypeId || ""}
							onChange={(e) =>
								handleBedTypeChange(index, Number(e.target.value))
							}
							displayEmpty
							sx={{ flex: 2 }}
							size="small"
						>
							<MenuItem value="" disabled>
								{t("common.selectBedType")}
							</MenuItem>
							{bedTypeOptions.map((option) => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</Select>
						<TextField
							type="number"
							label={t("common.quantity")}
							value={bedType.numBed}
							onChange={(e) =>
								handleQuantityChange(index, Number(e.target.value))
							}
							inputProps={{ min: 1 }}
							sx={{ flex: 1 }}
							size="small"
						/>
						<IconButton
							onClick={() => handleRemove(index)}
							color="error"
							size="small"
						>
							<Delete />
						</IconButton>
					</Box>
				))}
				<Button
					startIcon={<Add />}
					onClick={handleAdd}
					variant="outlined"
					size="small"
					sx={{ mt: 1 }}
				>
					{t("common.addBedType")}
				</Button>
			</Box>
			{showError && (
				<FormHelperText>
					<Typography color="error">{error}</Typography>
				</FormHelperText>
			)}
			{!showError && config.helperText && (
				<FormHelperText>
					{config.helperText ? t(config.helperText) : ""}
				</FormHelperText>
			)}
		</FormControl>
	);
};
