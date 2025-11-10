import { Delete, Edit } from "@mui/icons-material";
import { useSetAtom } from "jotai";
import {
	MRT_ActionMenuItem,
	type MRT_Row,
	type MRT_TableInstance,
} from "material-react-table";
import { useTranslation } from "react-i18next";
import { deleteBuilding, putBuilding } from "../../api/buildingApi";
import { buildingFormConfig } from "../../config/forms/buildingForm";
import type { BuildingData, BuildingFormData } from "../../interfaces/building";
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

interface BuildingRowActionsProps {
	row: MRT_Row<BuildingData>;
	table: MRT_TableInstance<BuildingData>;
	closeMenu: () => void;
}

const BuildingRowActions = ({
	row,
	table,
	closeMenu,
}: BuildingRowActionsProps) => {
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
		setConfirmQuestion("building.deleteConfirm");
		setConfirmColor("error");
		setConfirmButtonText("common.delete");
		setConfirmCallback(() => async () => {
			await deleteBuilding(id);
			setReloadTimestamp(Date.now());
		});
		setConfirmOpen(true);
		closeMenu();
	};

	const editHandler = (building: BuildingData) => {
		const handleSubmit = async (values: BuildingFormData) => {
			const res = await putBuilding(building.id, values);
			if (!res.error) {
				setReloadTimestamp(Date.now());
				setFormModalOpen(false);
			}
		};

		setFormModalTitle(t("building.editTitle"));
		setFormModalConfig(buildingFormConfig);
		setFormModalInitialValues({
			name: building.name,
			address: building.address,
			city: building.city,
			zipcode: building.zipcode,
			country: building.country,
			phoneNumber: building.phoneNumber,
			email: building.email,
			description: building.description || "",
			active: building.active ?? true,
		});
		setFormModalOnSubmit(
			() => handleSubmit as (values: FormValues) => Promise<void>,
		);
		setFormModalOpen(true);
		closeMenu();
	};


	return [
		<MRT_ActionMenuItem
			icon={<Edit color="primary" />}
			key={t("common.edit")}
			label={t("common.edit")}
			onClick={() => {
				editHandler(row.original);
			}}
			disabled={!hasPermission(["Admin", "Data Manager"])}
			table={table}
		/>,
		<MRT_ActionMenuItem
			icon={<Delete color="error" />}
			key={t("common.delete")}
			label={t("common.delete")}
			onClick={() => {
				deleteHandler(row.original.id);
			}}
			disabled={!hasPermission(["Admin", "Data Manager"])}
			table={table}
		/>,
	];
};

export default BuildingRowActions;
