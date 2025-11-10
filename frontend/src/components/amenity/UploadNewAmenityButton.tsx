import { Upload } from "@mui/icons-material";
import { useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { postAmenity } from "../../api/amenityApi";
import { amenityFormConfig } from "../../config/forms/amenityForm";
import type { AmenityFormData } from "../../interfaces/amenity";
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

const UploadNewAmenityBtn = () => {
	const { t } = useTranslation();
	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);
	const setFormModalOpen = useSetAtom(formModalOpenAtom);
	const setTitle = useSetAtom(formModalTitleAtom);
	const setConfig = useSetAtom(formModalConfigAtom);
	const setInitialValues = useSetAtom(formModalInitialValuesAtom);
	const setOnSubmit = useSetAtom(formModalOnSubmitAtom);

	const handleSubmit = async (values: AmenityFormData) => {
		const res = await postAmenity(values);
		if (!res.error) {
			setReloadTimestamp(Date.now());
			setFormModalOpen(false);
		}
	};

	const handleClick = () => {
		setTitle(t("amenity.uploadTitle"));
		setConfig(amenityFormConfig);
		setInitialValues({});
		setOnSubmit(() => handleSubmit as (values: FormValues) => Promise<void>);
		setFormModalOpen(true);
	};

	return (
		<ButtonUI
			color="primary"
			startIcon={<Upload />}
			label={t("amenity.upload")}
			onClick={handleClick}
			requiredPermissions={["Admin", "Data Manager"]}
			variant="contained"
		/>
	);
};

export default UploadNewAmenityBtn;
