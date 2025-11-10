import { Upload } from "@mui/icons-material";
import { useAtomValue, useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { postHousekeeping } from "../../api/housekeepingApi";
import { housekeepingFormConfig } from "../../config/forms/housekeepingForm";
import { HousekeepingPriority } from "../../interfaces/enums";
import type { HousekeepingFormData } from "../../interfaces/housekeeping";
import ButtonUI from "../../lib/ButtonUi";
import type { FormValues } from "../../lib/form";
import { reloadTimestampAtom } from "../../state/common";
import {
	formModalConfigAtom,
	formModalInitialValuesAtom,
	formModalOnSubmitAtom,
	formModalOpenAtom,
	formModalTitleAtom,
} from "../../state/formModal";
import { LoadableRoomAtom } from "../../state/room";
import { LoadableUserAtom } from "../../state/user";

const UploadNewHousekeepingButton = () => {
	const { t } = useTranslation();
	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);
	const setFormModalOpen = useSetAtom(formModalOpenAtom);
	const setTitle = useSetAtom(formModalTitleAtom);
	const setConfig = useSetAtom(formModalConfigAtom);
	const setInitialValues = useSetAtom(formModalInitialValuesAtom);
	const setOnSubmit = useSetAtom(formModalOnSubmitAtom);
	const loadableRooms = useAtomValue(LoadableRoomAtom);
	const loadableUsers = useAtomValue(LoadableUserAtom);

	const handleSubmit = async (values: HousekeepingFormData) => {
		const payload = {
			roomId: Number(values.roomId),
			userId: values.userId ? Number(values.userId) : undefined,
			priority: values.priority,
			note: values.note || "",
		};

		const res = await postHousekeeping(payload);
		if (!res.error) {
			setReloadTimestamp(Date.now());
			setFormModalOpen(false);
		}
	};

	const handleClick = () => {
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

		setTitle(t("housekeeping.uploadTitle"));
		setConfig(configWithOptions);
		setInitialValues({ priority: HousekeepingPriority.LOW });
		setOnSubmit(() => handleSubmit as (values: FormValues) => Promise<void>);
		setFormModalOpen(true);
	};

	return (
		<ButtonUI
			color="primary"
			startIcon={<Upload />}
			label={t("housekeeping.upload")}
			onClick={handleClick}
			requiredPermissions={["Admin", "Housekeeping"]}
			variant="contained"
		/>
	);
};

export default UploadNewHousekeepingButton;
