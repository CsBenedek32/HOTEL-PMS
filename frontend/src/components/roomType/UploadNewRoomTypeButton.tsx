import { Upload } from "@mui/icons-material";
import { useAtomValue, useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { postRoomType } from "../../api/roomTypeApi";
import { roomTypeFormConfig } from "../../config/forms/roomTypeForm";
import type {
	CreateRoomTypePayload,
	RoomTypeFormData,
} from "../../interfaces/roomType";
import ButtonUI from "../../lib/ButtonUi";
import type { FormConfig, FormValues } from "../../lib/form";
import { LoadableAmenityAtom } from "../../state/amenity";
import { LoadableBedTypeAtom } from "../../state/bedType";
import { reloadTimestampAtom } from "../../state/common";
import {
	formModalConfigAtom,
	formModalInitialValuesAtom,
	formModalOnSubmitAtom,
	formModalOpenAtom,
	formModalTitleAtom,
} from "../../state/formModal";

const UploadNewRoomTypeBtn = () => {
	const { t } = useTranslation();
	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);
	const setFormModalOpen = useSetAtom(formModalOpenAtom);
	const setTitle = useSetAtom(formModalTitleAtom);
	const setConfig = useSetAtom(formModalConfigAtom);
	const setInitialValues = useSetAtom(formModalInitialValuesAtom);
	const setOnSubmit = useSetAtom(formModalOnSubmitAtom);
	const loadableAmenities = useAtomValue(LoadableAmenityAtom);
	const loadableBedTypes = useAtomValue(LoadableBedTypeAtom);

	const handleSubmit = async (values: RoomTypeFormData) => {
		const submitData: CreateRoomTypePayload = {
			typeName: values.typeName,
			price: values.price,
			capacity: values.capacity,
			amenityIds:
				values.amenityIds?.map((option) => option.value as number) || [],
			bedTypes: values.bedTypes || [],
		};

		const res = await postRoomType(submitData);
		if (!res.error) {
			setReloadTimestamp(Date.now());
			setFormModalOpen(false);
		}
	};

	const handleClick = () => {
		const amenities =
			loadableAmenities.state === "hasData" ? loadableAmenities.data : [];
		const amenityOptions = amenities.map((amenity) => ({
			label: amenity.amenityName,
			value: amenity.id,
		}));

		const bedTypes =
			loadableBedTypes.state === "hasData" ? loadableBedTypes.data : [];
		const bedTypeOptions = bedTypes.map((bedType) => ({
			label: bedType.bedTypeName,
			value: bedType.id,
		}));

		const dynamicConfig: FormConfig = {
			...roomTypeFormConfig,
			amenityIds: {
				label: "forms.labels.amenities",
				type: "autocomplete",
				defaultValue: [],
				options: amenityOptions,
				multiple: true,
				validation: {
					required: false,
				},
			},
			bedTypes: {
				label: "forms.labels.bedTypes",
				type: "bedTypeQuantity",
				defaultValue: [],
				options: bedTypeOptions,
				validation: {
					required: false,
				},
			},
		};

		setTitle(t("roomType.uploadTitle"));
		setConfig(dynamicConfig);
		setInitialValues({
			capacity: 1,
		});
		setOnSubmit(() => handleSubmit as (values: FormValues) => Promise<void>);
		setFormModalOpen(true);
	};

	return (
		<ButtonUI
			color="primary"
			startIcon={<Upload />}
			label={t("roomType.upload")}
			onClick={handleClick}
			requiredPermissions={["Admin", "Data Manager"]}
			variant="contained"
		/>
	);
};

export default UploadNewRoomTypeBtn;
