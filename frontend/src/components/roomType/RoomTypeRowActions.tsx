import { Delete, Edit } from "@mui/icons-material";
import { useAtomValue, useSetAtom } from "jotai";
import {
	MRT_ActionMenuItem,
	type MRT_Row,
	type MRT_TableInstance,
} from "material-react-table";
import { useTranslation } from "react-i18next";
import { deleteRoomType, putRoomType } from "../../api/roomTypeApi";
import { roomTypeFormConfig } from "../../config/forms/roomTypeForm";
import type {
	RoomTypeData,
	UpdateRoomTypePayload,
} from "../../interfaces/roomType";
import type { FieldOption, FormConfig, FormValues } from "../../lib/form";
import { LoadableAmenityAtom } from "../../state/amenity";
import { LoadableBedTypeAtom } from "../../state/bedType";
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

function isFieldOptionArray(value: unknown): value is FieldOption[] {
	return (
		Array.isArray(value) &&
		(value.length === 0 || ("value" in value[0] && "label" in value[0]))
	);
}

interface RoomTypeRowActionsProps {
	row: MRT_Row<RoomTypeData>;
	table: MRT_TableInstance<RoomTypeData>;
	closeMenu: () => void;
}

const RoomTypeRowActions = ({
	row,
	table,
	closeMenu,
}: RoomTypeRowActionsProps) => {
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
	const loadableAmenities = useAtomValue(LoadableAmenityAtom);
	const loadableBedTypes = useAtomValue(LoadableBedTypeAtom);

	const deleteHandler = async (id: number) => {
		setConfirmQuestion("roomType.deleteConfirm");
		setConfirmColor("error");
		setConfirmButtonText("common.delete");
		setConfirmCallback(() => async () => {
			await deleteRoomType(id);
			setReloadTimestamp(Date.now());
		});
		setConfirmOpen(true);
		closeMenu();
	};

	const editHandler = (roomType: RoomTypeData) => {
		const handleSubmit = async (values: FormValues) => {
			const amenityOptions = values.amenityIds;
			const submitData: UpdateRoomTypePayload = {
				typeName: values.typeName as string,
				price: values.price as number,
				capacity: values.capacity as number,
				amenityIds: isFieldOptionArray(amenityOptions)
					? amenityOptions.map((option) => option.value as number)
					: [],
				bedTypes: values.bedTypes as UpdateRoomTypePayload["bedTypes"],
			};

			const res = await putRoomType(roomType.id, submitData);
			if (!res.error) {
				setReloadTimestamp(Date.now());
				setFormModalOpen(false);
			}
		};

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

		const initialBedTypes = roomType.bedTypes.map((bt) => ({
			bedTypeId: bt.bedType.id,
			numBed: bt.numBed,
		}));

		const initialAmenityOptions = roomType.amenities.map((a) => ({
			label: a.amenityName,
			value: a.id,
		}));

		setFormModalTitle(t("roomType.editTitle"));
		setFormModalConfig(dynamicConfig);
		setFormModalInitialValues({
			typeName: roomType.typeName,
			price: roomType.price,
			capacity: roomType.capacity,
			amenityIds: initialAmenityOptions,
			bedTypes: initialBedTypes,
		});
		setFormModalOnSubmit(() => handleSubmit);
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

export default RoomTypeRowActions;
