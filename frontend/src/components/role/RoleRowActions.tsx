import { Delete, Edit } from "@mui/icons-material";
import { useSetAtom } from "jotai";
import {
	MRT_ActionMenuItem,
	type MRT_Row,
	type MRT_TableInstance,
} from "material-react-table";
import { useTranslation } from "react-i18next";
import { deleteRole, putRole } from "../../api/roleApi";
import { roleFormConfig } from "../../config/forms/roleForm";
import type { RoleData, RoleFormData } from "../../interfaces/role";
import type { FormValues } from "../../lib/form";
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
import { hasPermission } from "../../utils/permissions";

interface RoleRowActionsProps {
	row: MRT_Row<RoleData>;
	table: MRT_TableInstance<RoleData>;
	closeMenu: () => void;
}

const RoleRowActions = ({ row, table, closeMenu }: RoleRowActionsProps) => {
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

	const deleteHandler = async (id: number) => {
		setConfirmQuestion("role.deleteConfirm");
		setConfirmColor("error");
		setConfirmButtonText("common.delete");
		setConfirmCallback(() => async () => {
			await deleteRole(id);
			setReloadTimestamp(Date.now());
		});
		setConfirmOpen(true);
		closeMenu();
	};

	const editHandler = (role: RoleData) => {
		const handleSubmit = async (values: RoleFormData) => {
			const res = await putRole(role.id, values);
			if (!res.error) {
				setReloadTimestamp(Date.now());
				setFormModalOpen(false);
			}
		};

		setFormModalTitle(t("role.editTitle"));
		setFormModalConfig(roleFormConfig);
		setFormModalInitialValues({ name: role.name });
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
			disabled={!hasPermission(["Admin"]) || row.original.immutable}
			table={table}
		/>,
		<MRT_ActionMenuItem
			icon={<Delete color="error" />}
			key={t("common.delete")}
			label={t("common.delete")}
			onClick={() => {
				deleteHandler(row.original.id);
			}}
			disabled={!hasPermission(["Admin"]) || row.original.immutable}
			table={table}
		/>,
	];
};

export default RoleRowActions;
