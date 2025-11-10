import { Create } from "@mui/icons-material";
import { useAtomValue, useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { postUser } from "../../api/userApi";
import { userFormConfig } from "../../config/forms/userForm";
import type { UpdateUserPayload, UserFormData } from "../../interfaces/user";
import ButtonUI from "../../lib/ButtonUi";
import type { FormConfig, FormValues } from "../../lib/form";
import { reloadTimestampAtom } from "../../state/common";
import {
	formModalConfigAtom,
	formModalInitialValuesAtom,
	formModalOnSubmitAtom,
	formModalOpenAtom,
	formModalTitleAtom,
} from "../../state/formModal";
import { LoadableRoleAtom } from "../../state/role";

const UploadNewUserBtn = () => {
	const { t } = useTranslation();
	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);
	const setFormModalOpen = useSetAtom(formModalOpenAtom);
	const setTitle = useSetAtom(formModalTitleAtom);
	const setConfig = useSetAtom(formModalConfigAtom);
	const setInitialValues = useSetAtom(formModalInitialValuesAtom);
	const setOnSubmit = useSetAtom(formModalOnSubmitAtom);
	const loadableRoles = useAtomValue(LoadableRoleAtom);

	const handleSubmit = async (values: UserFormData) => {
		const submitData = {
			...values,
			roleIds:
				values.roleIds.length > 0
					? values.roleIds.map((option) => option.value as number)
					: [],
		};
		const res = await postUser(submitData as UpdateUserPayload);
		if (!res.error) {
			setReloadTimestamp(Date.now());
			setFormModalOpen(false);
		}
	};

	const handleClick = () => {
		const roles = loadableRoles.state === "hasData" ? loadableRoles.data : [];
		const roleOptions = roles.map((role) => ({
			label: role.name,
			value: role.id,
		}));
		const dynamicConfig: FormConfig = {
			...userFormConfig,
			roleIds: {
				label: t("user.roles"),
				type: "autocomplete",
				defaultValue: [],
				options: roleOptions,
				multiple: true,
				validation: {
					required: false,
				},
			},
		};

		setTitle(t("user.uploadTitle"));
		setConfig(dynamicConfig);
		setInitialValues({ roleIds: [] } as Partial<UserFormData>);
		setOnSubmit(() => handleSubmit as (values: FormValues) => Promise<void>);
		setFormModalOpen(true);
	};

	return (
		<ButtonUI
			color="primary"
			startIcon={<Create />}
			label={t("user.upload")}
			onClick={handleClick}
			requiredPermissions={["Admin"]}
			variant="contained"
		/>
	);
};

export default UploadNewUserBtn;
