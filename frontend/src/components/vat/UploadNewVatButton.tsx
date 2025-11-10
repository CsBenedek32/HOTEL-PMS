import { Upload } from "@mui/icons-material";
import { useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { postVat } from "../../api/vatApi";
import { vatFormConfig } from "../../config/forms/vatForm";
import type { VatFormData } from "../../interfaces/vat";
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

const UploadNewVatBtn = () => {
	const { t } = useTranslation();
	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);
	const setFormModalOpen = useSetAtom(formModalOpenAtom);
	const setTitle = useSetAtom(formModalTitleAtom);
	const setConfig = useSetAtom(formModalConfigAtom);
	const setInitialValues = useSetAtom(formModalInitialValuesAtom);
	const setOnSubmit = useSetAtom(formModalOnSubmitAtom);

	const handleSubmit = async (values: VatFormData) => {
		const res = await postVat(values);
		if (!res.error) {
			setReloadTimestamp(Date.now());
			setFormModalOpen(false);
		}
	};

	const handleClick = () => {
		setTitle(t("vat.uploadTitle"));
		setConfig(vatFormConfig);
		setInitialValues({});
		setOnSubmit(() => handleSubmit as (values: FormValues) => Promise<void>);
		setFormModalOpen(true);
	};

	return (
		<ButtonUI
			color="primary"
			startIcon={<Upload />}
			label={t("vat.upload")}
			onClick={handleClick}
			requiredPermissions={["Admin", "Data Manager"]}
			variant="contained"
		/>
	);
};

export default UploadNewVatBtn;
