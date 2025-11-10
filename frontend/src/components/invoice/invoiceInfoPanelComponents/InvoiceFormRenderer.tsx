import { Box, Button, Grid, Typography } from "@mui/material";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type {
	invoiceBaseDataFormConfig,
	invoiceRecipientDataFormConfig,
} from "../../../config/forms/invoiceForm";
import {
	type FormErrors,
	FormFactory,
	type FormValues,
} from "../../../lib/form";
import { hasPermission } from "../../../utils/permissions";

interface InvoiceFormRendererProps {
	title: string;
	isEditing: boolean;
	onEdit: () => void;
	onReset: () => void;
	onSave: () => void;
	formKey: number;
	config:
	| typeof invoiceBaseDataFormConfig
	| typeof invoiceRecipientDataFormConfig;
	initialValues: FormValues;
	valuesRef: React.MutableRefObject<FormValues>;
	errors: FormErrors;
}

const InvoiceFormRenderer = ({
	title,
	isEditing,
	onEdit,
	onReset,
	onSave,
	formKey,
	config,
	initialValues,
	valuesRef,
	errors,
}: InvoiceFormRendererProps) => {
	const { t } = useTranslation();

	const getDisabledConfig = useCallback(() => {
		return Object.keys(config).reduce(
			(acc, key) => {
				acc[key] = { ...config[key as keyof typeof config], disabled: true };
				return acc;
			},
			{} as typeof config,
		);
	}, [config]);

	return (
		<Grid size={{ xs: 12, md: 6 }}>
			<Box
				sx={{
					p: 2,
					height: "100%",
					border: "1px solid",
					borderColor: "divider",
					backgroundColor: "background.default",
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mb: 2,
					}}
				>
					<Typography variant="h6">{title}</Typography>
					<Box sx={{ display: "flex", gap: 1 }}>
						{!isEditing ? (
							<Button variant="contained" size="small" onClick={onEdit} disabled={!hasPermission(["Admin", "Invoice Manager"])}>
								{t("common.edit")}
							</Button>
						) : (
							<>
								<Button variant="outlined" size="small" onClick={onReset}>
									{t("common.reset")}
								</Button>
								<Button variant="contained" size="small" onClick={onSave} >
									{t("common.save")}
								</Button>
							</>
						)}
					</Box>
				</Box>
				<FormFactory
					key={formKey}
					config={isEditing ? config : getDisabledConfig()}
					initialValues={initialValues}
					valuesRef={valuesRef}
					errors={errors}
				/>
			</Box>
		</Grid>
	);
};

export default InvoiceFormRenderer;
