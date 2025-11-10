import { Delete, Edit } from "@mui/icons-material";
import { useSetAtom } from "jotai";
import {
	MRT_ActionMenuItem,
	type MRT_Row,
	type MRT_TableInstance,
} from "material-react-table";
import { useTranslation } from "react-i18next";
import { deleteVat, putVat } from "../../api/vatApi";
import { vatFormConfig } from "../../config/forms/vatForm";
import type { VatData, VatFormData } from "../../interfaces/vat";
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

interface VatRowActionsProps {
	row: MRT_Row<VatData>;
	table: MRT_TableInstance<VatData>;
	closeMenu: () => void;
}

const VatRowActions = ({ row, table, closeMenu }: VatRowActionsProps) => {
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
		setConfirmQuestion("vat.deleteConfirm");
		setConfirmColor("error");
		setConfirmButtonText("common.delete");
		setConfirmCallback(() => async () => {
			await deleteVat(id);
			setReloadTimestamp(Date.now());
		});
		setConfirmOpen(true);
		closeMenu();
	};

	const editHandler = (vat: VatData) => {
		const handleSubmit = async (values: VatFormData) => {
			const res = await putVat(vat.id, values);
			if (!res.error) {
				setReloadTimestamp(Date.now());
				setFormModalOpen(false);
			}
		};

		setFormModalTitle(t("vat.editTitle"));
		setFormModalConfig(vatFormConfig);
		setFormModalInitialValues({ name: vat.name, percentage: vat.percentage });
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
			disabled={!hasPermission(["Admin", "Invoice Manager"])}
			table={table}
		/>,
		<MRT_ActionMenuItem
			icon={<Delete color="error" />}
			key={t("common.delete")}
			label={t("common.delete")}
			onClick={() => {
				deleteHandler(row.original.id);
			}}
			disabled={!hasPermission(["Admin", "Invoice Manager"])}
			table={table}
		/>,
	];
};

export default VatRowActions;
