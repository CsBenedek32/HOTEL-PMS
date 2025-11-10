import { Delete, Edit } from "@mui/icons-material";
import { useSetAtom } from "jotai";
import {
	MRT_ActionMenuItem,
	type MRT_Row,
	type MRT_TableInstance,
} from "material-react-table";
import { useTranslation } from "react-i18next";
import { deleteAmenity, putAmenity } from "../../api/amenityApi";
import { amenityFormConfig } from "../../config/forms/amenityForm";
import type { AmenityData, AmenityFormData } from "../../interfaces/amenity";
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

interface AmenityRowActionsProps {
	row: MRT_Row<AmenityData>;
	table: MRT_TableInstance<AmenityData>;
	closeMenu: () => void;
}

const AmenityRowActions = ({
	row,
	table,
	closeMenu,
}: AmenityRowActionsProps) => {
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
		setConfirmQuestion("amenity.deleteConfirm");
		setConfirmColor("error");
		setConfirmButtonText("common.delete");
		setConfirmCallback(() => async () => {
			await deleteAmenity(id);
			setReloadTimestamp(Date.now());
		});
		setConfirmOpen(true);
		closeMenu();
	};

	const editHandler = (amenity: AmenityData) => {
		const handleSubmit = async (values: AmenityFormData) => {
			const res = await putAmenity(amenity.id, values);
			if (!res.error) {
				setReloadTimestamp(Date.now());
				setFormModalOpen(false);
			}
		};

		setFormModalTitle(t("amenity.editTitle"));
		setFormModalConfig(amenityFormConfig);
		setFormModalInitialValues({ amenityName: amenity.amenityName });
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

export default AmenityRowActions;
