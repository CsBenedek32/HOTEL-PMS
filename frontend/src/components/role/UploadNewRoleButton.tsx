import { Upload } from "@mui/icons-material";
import { useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { postRole } from "../../api/roleApi";
import { roleFormConfig } from "../../config/forms/roleForm";
import type { RoleFormData } from "../../interfaces/role";
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

const UploadNewRoleBtn = () => {
	const { t } = useTranslation();
	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);
	const setFormModalOpen = useSetAtom(formModalOpenAtom);
	const setTitle = useSetAtom(formModalTitleAtom);
	const setConfig = useSetAtom(formModalConfigAtom);
	const setInitialValues = useSetAtom(formModalInitialValuesAtom);
	const setOnSubmit = useSetAtom(formModalOnSubmitAtom);

	const handleSubmit = async (values: RoleFormData) => {
		const res = await postRole(values);
		if (!res.error) {
			setReloadTimestamp(Date.now());
			setFormModalOpen(false);
		}
	};

	const handleClick = () => {
		setTitle(t("role.uploadTitle"));
		setConfig(roleFormConfig);
		setInitialValues({});
		setOnSubmit(() => handleSubmit as (values: FormValues) => Promise<void>);
		setFormModalOpen(true);
	};

	return (
		<ButtonUI
			color="primary"
			startIcon={<Upload />}
			label={t("role.upload")}
			onClick={handleClick}
			requiredPermissions={["Admin"]}
			variant="contained"
		/>
	);
};

export default UploadNewRoleBtn;
