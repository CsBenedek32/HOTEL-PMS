import { Settings } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { putInvoice } from "../../../api/invoiceApi";
import {
	invoiceBaseDataFormConfig,
	invoiceRecipientDataFormConfig,
} from "../../../config/forms/invoiceForm";
import type { PaymentStatus } from "../../../interfaces/enums";
import type { InvoiceData } from "../../../interfaces/invoice";
import {
	type FormErrors,
	type FormValues,
	hasErrors,
	validateForm,
} from "../../../lib/form";
import { InfoSection } from "../../common/InfoDrawerComponents";
import InvoiceFormRenderer from "./InvoiceFormRenderer";

interface InvoiceInfoDetailsProps {
	selectedInvoice: InvoiceData;
	onUpdate: () => void;
}

const InvoiceInfoDetails = ({
	selectedInvoice,
	onUpdate,
}: InvoiceInfoDetailsProps) => {
	const { t } = useTranslation();
	const [isEditingBaseData, setIsEditingBaseData] = useState(false);
	const [isEditingRecipientData, setIsEditingRecipientData] = useState(false);

	const baseDataValuesRef = useRef<FormValues>({});
	const recipientDataValuesRef = useRef<FormValues>({});

	const [baseDataErrors, setBaseDataErrors] = useState<FormErrors>({});
	const [recipientDataErrors, setRecipientDataErrors] = useState<FormErrors>(
		{},
	);

	const [baseDataKey, setBaseDataKey] = useState(0);
	const [recipientDataKey, setRecipientDataKey] = useState(0);

	const getInitialBaseDataValues = useCallback(
		() => ({
			name: selectedInvoice.name,
			description: selectedInvoice.description || "",
			paymentStatus: selectedInvoice.paymentStatus,
			totalSum: `$${selectedInvoice.totalSum?.toFixed(2) || "0.00"}`,
		}),
		[selectedInvoice],
	);

	const getInitialRecipientDataValues = useCallback(
		() => ({
			recipientName: selectedInvoice.recipientName,
			recipientCompanyName: selectedInvoice.recipientCompanyName,
			recipientEmail: selectedInvoice.recipientEmail,
			recipientPhone: selectedInvoice.recipientPhone,
			recipientAddress: selectedInvoice.recipientAddress,
			recipientCity: selectedInvoice.recipientCity,
			recipientPostalCode: selectedInvoice.recipientPostalCode,
			recipientCountry: selectedInvoice.recipientCountry,
			recipientTaxNumber: selectedInvoice.recipientTaxNumber,
		}),
		[selectedInvoice],
	);

	const relatedEntityIds = useMemo(
		() => ({
			bookingIds: selectedInvoice.bookings.map((b) => b.id),
			serviceModelIds: selectedInvoice.serviceModels.map((s) => s.id),
		}),
		[selectedInvoice],
	);

	const handleEditBaseData = useCallback(() => {
		setIsEditingBaseData(true);
		baseDataValuesRef.current = getInitialBaseDataValues();
	}, [getInitialBaseDataValues]);

	const handleSaveBaseData = useCallback(async () => {
		const validationErrors = validateForm(
			baseDataValuesRef.current,
			invoiceBaseDataFormConfig,
		);
		setBaseDataErrors(validationErrors);

		if (hasErrors(validationErrors)) return;

		try {
			const payload = {
				name:
					(baseDataValuesRef.current.name as string) ??
					selectedInvoice.name ??
					"",
				description:
					(baseDataValuesRef.current.description as string) ??
					selectedInvoice.description ??
					"",
				paymentStatus:
					(baseDataValuesRef.current.paymentStatus as PaymentStatus) ??
					selectedInvoice.paymentStatus,
				...getInitialRecipientDataValues(),
				...relatedEntityIds,
			};
			await putInvoice(selectedInvoice.id, payload);
			setIsEditingBaseData(false);
			setBaseDataErrors({});
			onUpdate();
		} catch (error) {
			console.log(error);
		}
	}, [
		selectedInvoice,
		getInitialRecipientDataValues,
		relatedEntityIds,
		onUpdate,
	]);

	const handleResetBaseData = useCallback(() => {
		setBaseDataKey((prev) => prev + 1);
		setIsEditingBaseData(false);
		setBaseDataErrors({});
	}, []);

	const handleEditRecipientData = useCallback(() => {
		setIsEditingRecipientData(true);
		recipientDataValuesRef.current = getInitialRecipientDataValues();
	}, [getInitialRecipientDataValues]);

	const handleSaveRecipientData = useCallback(async () => {
		const validationErrors = validateForm(
			recipientDataValuesRef.current,
			invoiceRecipientDataFormConfig,
		);
		setRecipientDataErrors(validationErrors);

		if (hasErrors(validationErrors)) return;

		try {
			const recipientFields = Object.keys(
				getInitialRecipientDataValues(),
			).reduce(
				(acc, key) => {
					acc[key] =
						(recipientDataValuesRef.current[key] as string) ??
						selectedInvoice[key as keyof InvoiceData] ??
						"";
					return acc;
				},
				{} as Record<string, string>,
			);

			const payload = {
				...getInitialBaseDataValues(),
				...recipientFields,
				...relatedEntityIds,
			};
			await putInvoice(selectedInvoice.id, payload);
			setIsEditingRecipientData(false);
			setRecipientDataErrors({});
			onUpdate();
		} catch (error) {
			console.log(error);
		}
	}, [
		selectedInvoice,
		getInitialBaseDataValues,
		getInitialRecipientDataValues,
		relatedEntityIds,
		onUpdate,
	]);

	const handleResetRecipientData = useCallback(() => {
		setRecipientDataKey((prev) => prev + 1);
		setIsEditingRecipientData(false);
		setRecipientDataErrors({});
	}, []);

	return (
		<InfoSection
			title={t("invoice.details")}
			icon={<Settings color="primary" />}
		>
			<Grid container spacing={2}>
				<InvoiceFormRenderer
					title={t("invoice.baseData")}
					isEditing={isEditingBaseData}
					onEdit={handleEditBaseData}
					onReset={handleResetBaseData}
					onSave={handleSaveBaseData}
					formKey={baseDataKey}
					config={invoiceBaseDataFormConfig}
					initialValues={getInitialBaseDataValues()}
					valuesRef={baseDataValuesRef}
					errors={baseDataErrors}
				/>

				<InvoiceFormRenderer
					title={t("invoice.recipientData")}
					isEditing={isEditingRecipientData}
					onEdit={handleEditRecipientData}
					onReset={handleResetRecipientData}
					onSave={handleSaveRecipientData}
					formKey={recipientDataKey}
					config={invoiceRecipientDataFormConfig}
					initialValues={getInitialRecipientDataValues()}
					valuesRef={recipientDataValuesRef}
					errors={recipientDataErrors}
				/>
			</Grid>
		</InfoSection>
	);
};

export default InvoiceInfoDetails;
