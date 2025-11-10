import {
	CheckCircle,
	Delete,
	Edit,
	OfflineBolt,
	RunCircle,
} from "@mui/icons-material";
import { useAtomValue, useSetAtom } from "jotai";
import {
	MRT_ActionMenuItem,
	type MRT_Row,
	type MRT_TableInstance,
} from "material-react-table";
import { useTranslation } from "react-i18next";
import {
	deleteHousekeeping,
	putHousekeeping,
	setHousekeepingStatus,
} from "../../api/housekeepingApi";
import { housekeepingFormConfig } from "../../config/forms/housekeepingForm";
import { HousekeepingStatus } from "../../interfaces/enums";
import type {
	HousekeepingData,
	HousekeepingFormData,
} from "../../interfaces/housekeeping";
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
import { LoadableRoomAtom } from "../../state/room";
import { LoadableUserAtom } from "../../state/user";
import { hasPermission } from "../../utils/permissions";

interface HousekeepingRowActionsProps {
	row: MRT_Row<HousekeepingData>;
	table: MRT_TableInstance<HousekeepingData>;
	closeMenu: () => void;
}

const HousekeepingRowActions = ({
	row,
	table,
	closeMenu,
}: HousekeepingRowActionsProps) => {
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
	const loadableRooms = useAtomValue(LoadableRoomAtom);
	const loadableUsers = useAtomValue(LoadableUserAtom);

	const deleteHandler = async (id: number) => {
		setConfirmQuestion("housekeeping.deleteConfirm");
		setConfirmColor("error");
		setConfirmButtonText("common.delete");
		setConfirmCallback(() => async () => {
			await deleteHousekeeping(id);
			setReloadTimestamp(Date.now());
		});
		setConfirmOpen(true);
		closeMenu();
	};

	const editHandler = (housekeeping: HousekeepingData) => {
		const handleSubmit = async (values: HousekeepingFormData) => {
			const payload = {
				roomId: Number(values.roomId),
				userId: values.userId ? Number(values.userId) : undefined,
				priority: values.priority,
				note: values.note || "",
			};

			const res = await putHousekeeping(housekeeping.id, payload);
			if (!res.error) {
				setReloadTimestamp(Date.now());
				setFormModalOpen(false);
			}
		};

		const configWithOptions = { ...housekeepingFormConfig };

		if (loadableRooms.state === "hasData") {
			configWithOptions.roomId = {
				...configWithOptions.roomId,
				options: loadableRooms.data.map((room) => ({
					value: room.id,
					label: `${room.building.name} ${room.roomNumber} - ${room.status}`,
				})),
			};
		}

		if (loadableUsers.state === "hasData") {
			configWithOptions.userId = {
				...configWithOptions.userId,
				options: loadableUsers.data.map((user) => ({
					value: user.id,
					label: `${user.firstName} ${user.lastName}`,
				})),
			};
		}

		setFormModalTitle(t("housekeeping.editTitle"));
		setFormModalConfig(configWithOptions);
		setFormModalInitialValues({
			roomId: housekeeping.room.id,
			userId: housekeeping.user?.id,
			priority: housekeeping.priority,
			note: housekeeping.note || "",
		});
		setFormModalOnSubmit(
			() => handleSubmit as (values: FormValues) => Promise<void>,
		);
		setFormModalOpen(true);
		closeMenu();
	};

	const setStatusHandler = async (id: number, status: HousekeepingStatus) => {
		setConfirmQuestion("housekeeping.areYouSureChangeStatus");
		setConfirmColor("success");
		setConfirmButtonText("common.yes");
		setConfirmCallback(() => async () => {
			await setHousekeepingStatus(id, status);
			setReloadTimestamp(Date.now());
		});
		setConfirmOpen(true);
		closeMenu();
	};

	return [
		<MRT_ActionMenuItem
			icon={<CheckCircle color="success" />}
			key={t("housekeeping.done")}
			label={t("housekeeping.done")}
			onClick={() => {
				setStatusHandler(row.original.id, HousekeepingStatus.DONE);
			}}
			disabled={
				!hasPermission(["Admin", "Housekeeping"]) || row.original.status === HousekeepingStatus.DONE
			}
			table={table}
		/>,
		<MRT_ActionMenuItem
			icon={<RunCircle color="warning" />}
			key={t("housekeeping.inProgress")}
			label={t("housekeeping.inProgress")}
			onClick={() => {
				setStatusHandler(row.original.id, HousekeepingStatus.IN_PROGRESS);
			}}
			disabled={
				!hasPermission(["Admin", "Housekeeping"]) ||
				row.original.status === HousekeepingStatus.IN_PROGRESS
			}
			table={table}
		/>,
		<MRT_ActionMenuItem
			icon={<OfflineBolt color="error" />}
			key={t("housekeeping.TODO")}
			label={t("housekeeping.TODO")}
			onClick={() => {
				setStatusHandler(row.original.id, HousekeepingStatus.TO_DO);
			}}
			disabled={
				!hasPermission(["Admin", "Housekeeping"]) || row.original.status === HousekeepingStatus.TO_DO
			}
			table={table}
		/>,
		<MRT_ActionMenuItem
			icon={<Edit color="secondary" />}
			key={t("common.edit")}
			label={t("common.edit")}
			onClick={() => {
				editHandler(row.original);
			}}
			disabled={!hasPermission(["Admin", "Housekeeping"])}
			table={table}
		/>,
		<MRT_ActionMenuItem
			icon={<Delete color="error" />}
			key={t("common.delete")}
			label={t("common.delete")}
			onClick={() => {
				deleteHandler(row.original.id);
			}}
			disabled={!hasPermission(["Admin", "Housekeeping"])}
			table={table}
		/>,
	];
};

export default HousekeepingRowActions;
