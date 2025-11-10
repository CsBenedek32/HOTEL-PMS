import { Upload } from "@mui/icons-material";
import { useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { postInvoice } from "../../api/invoiceApi";
import { invoiceCreateFormConfig } from "../../config/forms/invoiceForm";
import type { CreateInvoicePayload } from "../../interfaces/invoice";
import ButtonUI from "../../lib/ButtonUi";
import type { FormValues } from "../../lib/form";
import { reloadTimestampAtom } from "../../state/common";
import {
	formModalConfigAtom,
	formModalInitialValuesAtom,
	formModalOnSubmitAtom,
	formModalOpenAtom,
	formModalTitleAtom,
} from "../../state/formModal";

interface InvoiceFormData extends FormValues {
	name: string;
}

const UploadNewInvoiceBtn = () => {
	const { t } = useTranslation();
	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);
	const setFormModalOpen = useSetAtom(formModalOpenAtom);
	const setTitle = useSetAtom(formModalTitleAtom);
	const setConfig = useSetAtom(formModalConfigAtom);
	const setInitialValues = useSetAtom(formModalInitialValuesAtom);
	const setOnSubmit = useSetAtom(formModalOnSubmitAtom);

	const handleSubmit = async (values: InvoiceFormData) => {
		const submitData: CreateInvoicePayload = {
			name: values.name,
		};
		const res = await postInvoice(submitData);
		if (!res.error) {
			setReloadTimestamp(Date.now());
			setFormModalOpen(false);
		}
	};

	const handleClick = () => {
		setTitle(t("invoice.uploadTitle"));
		setConfig(invoiceCreateFormConfig);
		setInitialValues({});
		setOnSubmit(() => handleSubmit as (values: FormValues) => Promise<void>);
		setFormModalOpen(true);
	};

	return (
		<ButtonUI
			color="primary"
			startIcon={<Upload />}
			label={t("invoice.upload")}
			onClick={handleClick}
			requiredPermissions={["Admin", "Invoice Manager"]}
			variant="contained"
		/>
	);
};

export default UploadNewInvoiceBtn;
