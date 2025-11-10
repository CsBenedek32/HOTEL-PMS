import { Check, Close, Delete, Edit } from "@mui/icons-material";
import { useAtomValue, useSetAtom } from "jotai";
import {
	MRT_ActionMenuItem,
	type MRT_Row,
	type MRT_TableInstance,
} from "material-react-table";
import { useTranslation } from "react-i18next";
import { activateUser, deactivateUser, deleteUser, putUser } from "../../api/userApi";
import { userFormConfig } from "../../config/forms/userForm";
import type {
	UpdateUserPayload,
	UserData,
	UserFormData,
} from "../../interfaces/user";
import type { FormConfig, FormValues } from "../../lib/form";
import { reloadTimestampAtom } from "../../state/common";
import {
	confirmModalButtonTextAtom,
	confirmModalCallbackAtom,
	confirmModalColorAtom,
	confirmModalOpenAtom,
	confirmModalQuestionAtom,
} from "../../state/confirmModal";
import {
	formModalConfigAtom,
	formModalInitialValuesAtom,
	formModalOnSubmitAtom,
	formModalOpenAtom,
	formModalTitleAtom,
} from "../../state/formModal";
import { LoadableRoleAtom } from "../../state/role";
import { userAtom } from "../../state/userState";
import { hasPermission } from "../../utils/permissions";

interface UserRowActionsProps {
	row: MRT_Row<UserData>;
	table: MRT_TableInstance<UserData>;
	closeMenu: () => void;
}

const UserRowActions = ({ row, table, closeMenu }: UserRowActionsProps) => {
	const { t } = useTranslation();

	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);
	const setConfirmOpen = useSetAtom(confirmModalOpenAtom);
	const setConfirmQuestion = useSetAtom(confirmModalQuestionAtom);
	const setConfirmCallback = useSetAtom(confirmModalCallbackAtom);
	const setConfirmColor = useSetAtom(confirmModalColorAtom);
	const setConfirmButtonText = useSetAtom(confirmModalButtonTextAtom);
	const setFormModalOpen = useSetAtom(formModalOpenAtom);
	const setFormModalTitle = useSetAtom(formModalTitleAtom);
	const setFormModalConfig = useSetAtom(formModalConfigAtom);
	const setFormModalInitialValues = useSetAtom(formModalInitialValuesAtom);
	const setFormModalOnSubmit = useSetAtom(formModalOnSubmitAtom);
	const loadableRoles = useAtomValue(LoadableRoleAtom);

	const me = useAtomValue(userAtom);

	const deleteHandler = async (id: number) => {
		setConfirmQuestion("user.deleteConfirm");
		setConfirmColor("error");
		setConfirmButtonText("common.delete");
		setConfirmCallback(() => async () => {
			await deleteUser(id);
			setReloadTimestamp(Date.now());
		});
		setConfirmOpen(true);
		closeMenu();
	};

	const activateUserHandler = async (id: number) => {
		setConfirmQuestion("user.activateConfirm");
		setConfirmColor("success");
		setConfirmButtonText("common.activate");
		setConfirmCallback(() => async () => {
			await activateUser(id);
			setReloadTimestamp(Date.now());
		});
		setConfirmOpen(true);
		closeMenu();
	};
	const deactivateUserHandler = async (id: number) => {
		setConfirmQuestion("user.deactivateConfirm");
		setConfirmColor("error");
		setConfirmButtonText("user.deactivate");
		setConfirmCallback(() => async () => {
			await deactivateUser(id);
			setReloadTimestamp(Date.now());
		});
		setConfirmOpen(true);
		closeMenu();
	};

	const editHandler = (user: UserData) => {
		const handleSubmit = async (values: UserFormData) => {
			const submitData = {
				...values,
				roleIds: values.roleIds.map((option) => option.value as number),
			};
			const res = await putUser(user.id, submitData as UpdateUserPayload);
			if (!res.error) {
				setReloadTimestamp(Date.now());
				setFormModalOpen(false);
			}
		};

		const roles = loadableRoles.state === "hasData" ? loadableRoles.data : [];
		const roleOptions = roles.map((role) => ({
			label: role.name,
			value: role.id,
		}));

		const editConfig: FormConfig = {
			firstName: userFormConfig.firstName,
			lastName: userFormConfig.lastName,
			phone: userFormConfig.phone,
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

		const selectedRoleOptions =
			user.roles?.map((role) => ({
				label: role.name,
				value: role.id,
			})) || [];

		setFormModalTitle(t("user.editTitle"));
		setFormModalConfig(editConfig);
		setFormModalInitialValues({
			firstName: user.firstName,
			lastName: user.lastName,
			phone: user.phone,
			email: user.email,
			roleIds: selectedRoleOptions,
		});
		setFormModalOnSubmit(
			() => handleSubmit as (values: FormValues) => Promise<void>,
		);
		setFormModalOpen(true);
		closeMenu();
	};

	return [
		<MRT_ActionMenuItem
			icon={<Edit color="secondary" />}
			key={t("common.edit")}
			label={t("common.edit")}
			onClick={() => {
				editHandler(row.original);
			}}
			disabled={!hasPermission(["Admin"])}
			table={table}
		/>,
		<MRT_ActionMenuItem
			icon={<Delete color="error" />}
			key={t("common.delete")}
			label={t("common.delete")}
			onClick={() => {
				deleteHandler(row.original.id);
			}}
			disabled={!hasPermission(["Admin"])}
			table={table}
		/>,
		...(row.original.email !== me?.email
			? row.original.active
				? [
					<MRT_ActionMenuItem
						icon={<Close color="error" />}
						key={t("user.deactivate")}
						label={t("user.deactivate")}
						onClick={() => deactivateUserHandler(row.original.id)}
						disabled={!hasPermission(["Admin"])}
						table={table}
					/>,
				]
				: [
					<MRT_ActionMenuItem
						icon={<Check color="success" />}
						key={t("user.activate")}
						label={t("user.activate")}
						onClick={() => activateUserHandler(row.original.id)}
						disabled={!hasPermission(["Admin"])}
						table={table}
					/>,
				]
			: []),
	];
};

export default UserRowActions;
