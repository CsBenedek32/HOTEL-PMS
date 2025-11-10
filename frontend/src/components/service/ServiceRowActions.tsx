import { Delete, Edit } from "@mui/icons-material";
import { useSetAtom } from "jotai";
import {
	MRT_ActionMenuItem,
	type MRT_Row,
	type MRT_TableInstance,
} from "material-react-table";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteService, putService } from "../../api/serviceApi";
import { getVats } from "../../api/vatApi";
import { serviceFormConfig } from "../../config/forms/serviceForm";
import type { ServiceData, ServiceFormData } from "../../interfaces/service";
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

interface ServiceRowActionsProps {
	row: MRT_Row<ServiceData>;
	table: MRT_TableInstance<ServiceData>;
	closeMenu: () => void;
}

const ServiceRowActions = ({
	row,
	table,
	closeMenu,
}: ServiceRowActionsProps) => {
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
	const [vats, setVats] = useState<{ value: number; label: string }[]>([]);

	useEffect(() => {
		const loadVats = async () => {
			const vatsData = await getVats();
			setVats(
				vatsData.map((vat) => ({
					value: vat.id,
					label: `${vat.name} (${vat.percentage}%)`,
				})),
			);
		};
		loadVats();
	}, []);

	const deleteHandler = async (id: number) => {
		setConfirmQuestion("service.deleteConfirm");
		setConfirmColor("error");
		setConfirmButtonText("common.delete");
		setConfirmCallback(() => async () => {
			await deleteService(id);
			setReloadTimestamp(Date.now());
		});
		setConfirmOpen(true);
		closeMenu();
	};

	const editHandler = (service: ServiceData) => {
		const handleSubmit = async (values: ServiceFormData) => {
			const res = await putService(service.id, values);
			if (!res.error) {
				setReloadTimestamp(Date.now());
				setFormModalOpen(false);
			}
		};

		const isImmutable = service.immutable === true;

		setFormModalTitle(t("service.editTitle"));
		const configWithVats = {
			...serviceFormConfig,
			name: {
				...serviceFormConfig.name,
				disabled: isImmutable,
			},
			description: {
				...serviceFormConfig.description,
				disabled: isImmutable,
			},
			cost: {
				...serviceFormConfig.cost,
				disabled: isImmutable,
			},
			vatId: {
				...serviceFormConfig.vatId,
				options: vats,
				disabled: false, // VAT is always editable
			},
		};
		setFormModalConfig(configWithVats);
		setFormModalInitialValues({
			name: service.name,
			description: service.description || "",
			cost: service.cost || 0,
			vatId: service.vat?.id || "",
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
			disabled={!hasPermission(["Admin", "Invoice Manager"]) || row.original.immutable === true}
			table={table}
		/>,
	];
};

export default ServiceRowActions;
