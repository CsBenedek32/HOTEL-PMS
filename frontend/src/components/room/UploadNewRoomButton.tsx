import { Upload } from "@mui/icons-material";
import { useAtomValue, useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { postRoom } from "../../api/roomApi";
import { roomFormConfig } from "../../config/forms/roomForm";
import { RoomStatus } from "../../interfaces/enums";
import type { CreateRoomPayload } from "../../interfaces/room";
import ButtonUI from "../../lib/ButtonUi";
import type { FormValues } from "../../lib/form";
import { LoadableBuildingAtom } from "../../state/building";
import { reloadTimestampAtom } from "../../state/common";
import {
	formModalConfigAtom,
	formModalInitialValuesAtom,
	formModalOnSubmitAtom,
	formModalOpenAtom,
	formModalTitleAtom,
} from "../../state/formModal";
import { LoadableRoomTypeAtom } from "../../state/roomType";

const UploadNewRoomBtn = () => {
	const { t } = useTranslation();
	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);
	const setFormModalOpen = useSetAtom(formModalOpenAtom);
	const setTitle = useSetAtom(formModalTitleAtom);
	const setConfig = useSetAtom(formModalConfigAtom);
	const setInitialValues = useSetAtom(formModalInitialValuesAtom);
	const setOnSubmit = useSetAtom(formModalOnSubmitAtom);

	const buildingsLoadable = useAtomValue(LoadableBuildingAtom);
	const roomTypesLoadable = useAtomValue(LoadableRoomTypeAtom);

	const handleSubmit = async (values: FormValues) => {
		const payload: CreateRoomPayload = {
			roomNumber: values.roomNumber as string,
			floorNumber: values.floorNumber as number,
			status: values.status as CreateRoomPayload["status"],
			description: values.description as string | undefined,
			roomTypeId: values.roomTypeId as number,
			buildingId: values.buildingId as number,
		};

		const res = await postRoom(payload);
		if (!res.error) {
			setReloadTimestamp(Date.now());
			setFormModalOpen(false);
		}
	};

	const handleClick = () => {
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

		setTitle(t("room.uploadTitle"));
		setConfig(configWithOptions);
		setInitialValues({ floorNumber: 1, status: RoomStatus.CLEAN });
		setOnSubmit(() => handleSubmit as (values: FormValues) => Promise<void>);
		setFormModalOpen(true);
	};

	return (
		<ButtonUI
			color="primary"
			startIcon={<Upload />}
			label={t("room.upload")}
			onClick={handleClick}
			requiredPermissions={["Admin", "Data Manager"]}
			variant="contained"
		/>
	);
};

export default UploadNewRoomBtn;
