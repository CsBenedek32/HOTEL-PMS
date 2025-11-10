import {
	CheckCircle,
	CleaningServices,
	Delete,
	Edit,
	ReportProblem,
} from "@mui/icons-material";
import { useAtomValue, useSetAtom } from "jotai";
import {
	MRT_ActionMenuItem,
	type MRT_Row,
	type MRT_TableInstance,
} from "material-react-table";
import { useTranslation } from "react-i18next";
import { deleteRoom, putRoom } from "../../api/roomApi";
import { roomFormConfig } from "../../config/forms/roomForm";
import { RoomStatus } from "../../interfaces/enums";
import type { RoomData, UpdateRoomPayload } from "../../interfaces/room";
import type { FormValues } from "../../lib/form";
import { LoadableBuildingAtom } from "../../state/building";
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
import { LoadableRoomTypeAtom } from "../../state/roomType";
import { hasPermission } from "../../utils/permissions";

interface RoomRowActionsProps {
	row: MRT_Row<RoomData>;
	table: MRT_TableInstance<RoomData>;
	closeMenu: () => void;
}

const RoomRowActions = ({ row, table, closeMenu }: RoomRowActionsProps) => {
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

	const buildingsLoadable = useAtomValue(LoadableBuildingAtom);
	const roomTypesLoadable = useAtomValue(LoadableRoomTypeAtom);

	const deleteHandler = async (id: number) => {
		setConfirmQuestion("room.deleteConfirm");
		setConfirmColor("error");
		setConfirmButtonText("common.delete");
		setConfirmCallback(() => async () => {
			await deleteRoom(id);
			setReloadTimestamp(Date.now());
		});
		setConfirmOpen(true);
		closeMenu();
	};

	const editHandler = (room: RoomData) => {
		const handleSubmit = async (values: FormValues) => {
			const payload: UpdateRoomPayload = {
				roomNumber: values.roomNumber as string,
				floorNumber: values.floorNumber as number,
				status: values.status as RoomData["status"],
				description: values.description as string | undefined,
				roomTypeId: values.roomTypeId as number | undefined,
				buildingId: values.buildingId as number | undefined,
			};

			const res = await putRoom(room.id, payload);
			if (!res.error) {
				setReloadTimestamp(Date.now());
				setFormModalOpen(false);
			}
		};

		const configWithOptions = { ...roomFormConfig };

		if (buildingsLoadable.state === "hasData") {
			configWithOptions.buildingId = {
				...configWithOptions.buildingId,
				options: buildingsLoadable.data.map((building) => ({
					value: building.id,
					label: building.name,
				})),
			};
		}
		if (roomTypesLoadable.state === "hasData") {
			configWithOptions.roomTypeId = {
				...configWithOptions.roomTypeId,
				options: roomTypesLoadable.data.map((roomType) => ({
					value: roomType.id,
					label: roomType.typeName,
				})),
			};
		}

		setFormModalTitle(t("room.editTitle"));
		setFormModalConfig(configWithOptions);
		setFormModalInitialValues({
			roomNumber: room.roomNumber,
			floorNumber: room.floorNumber,
			status: room.status,
			description: room.description || "",
			roomTypeId: room.roomType.id,
			buildingId: room.building.id,
		});
		setFormModalOnSubmit(
			() => handleSubmit as (values: FormValues) => Promise<void>,
		);
		setFormModalOpen(true);
		closeMenu();
	};

	const setRoomStatusHandler = async (
		room: RoomData,
		newStatus: RoomData["status"],
	) => {
		const payload: UpdateRoomPayload = {
			roomNumber: room.roomNumber,
			floorNumber: room.floorNumber,
			status: newStatus,
			description: room.description,
			roomTypeId: room.roomType.id,
			buildingId: room.building.id,
		};

		await putRoom(room.id, payload);
		setReloadTimestamp(Date.now());
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
			disabled={!hasPermission(["Admin", "Housekeeping", "Data Manager"])}
			table={table}
		/>,
		<MRT_ActionMenuItem
			icon={<CheckCircle color="success" />}
			key={t("room.setClean")}
			label={t("room.setClean")}
			onClick={() => {
				setRoomStatusHandler(row.original, RoomStatus.CLEAN);
			}}
			disabled={!hasPermission(["Admin", "Housekeeping", "Data Manager"]) || row.original.status === RoomStatus.CLEAN}
			table={table}
		/>,
		<MRT_ActionMenuItem
			icon={<CleaningServices style={{ color: "#ff9800" }} />}
			key={t("room.setDirty")}
			label={t("room.setDirty")}
			onClick={() => {
				setRoomStatusHandler(row.original, RoomStatus.DIRTY);
			}}
			disabled={!hasPermission(["Admin", "Housekeeping", "Data Manager"]) || row.original.status === RoomStatus.DIRTY}
			table={table}
		/>,
		<MRT_ActionMenuItem
			icon={<ReportProblem color="warning" />}
			key={t("room.setOutOfService")}
			label={t("room.setOutOfService")}
			onClick={() => {
				setRoomStatusHandler(row.original, RoomStatus.OUT_OF_SERVICE);
			}}
			disabled={
				!hasPermission(["Admin", "Housekeeping", "Data Manager"]) || row.original.status === RoomStatus.OUT_OF_SERVICE
			}
			table={table}
		/>,
		<MRT_ActionMenuItem
			icon={<Delete color="error" />}
			key={t("common.delete")}
			label={t("common.delete")}
			onClick={() => {
				deleteHandler(row.original.id);
			}}
			disabled={!hasPermission(["Admin", "Housekeeping", "Data Manager"])}
			table={table}
		/>,
	];
};

export default RoomRowActions;
