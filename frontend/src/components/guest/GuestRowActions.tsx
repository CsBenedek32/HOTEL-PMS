import { Delete, Edit } from "@mui/icons-material";
import { useAtomValue, useSetAtom } from "jotai";
import {
	MRT_ActionMenuItem,
	type MRT_Row,
	type MRT_TableInstance,
} from "material-react-table";
import { useTranslation } from "react-i18next";
import { deleteGuest, putGuest } from "../../api/guestApi";
import { guestFormConfig } from "../../config/forms/guestForm";
import type {
	GuestData,
	GuestFormData,
	UpdateGuestPayload,
} from "../../interfaces/guest";
import type { FormConfig, FormValues } from "../../lib/form";
import { reloadTimestampAtom } from "../../state/common";
import {
	confirmModalButtonTextAtom,
	confirmModalCallbackAtom,
	confirmModalColorAtom,
	confirmModalOpenAtom,
	confirmModalQuestionAtom,
} from "../../state/confirmModal";
import { LoadableCountriesAtom } from "../../state/countries";
import {
	formModalConfigAtom,
	formModalInitialValuesAtom,
	formModalOnSubmitAtom,
	formModalOpenAtom,
	formModalTitleAtom,
} from "../../state/formModal";
import { LoadableGuestTagAtom } from "../../state/guestTag";
import { hasPermission } from "../../utils/permissions";

interface GuestRowActionsProps {
	row: MRT_Row<GuestData>;
	table: MRT_TableInstance<GuestData>;
	closeMenu: () => void;
}

const GuestRowActions = ({ row, table, closeMenu }: GuestRowActionsProps) => {
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
	const loadableGuestTags = useAtomValue(LoadableGuestTagAtom);
	const loadableCountries = useAtomValue(LoadableCountriesAtom);

	const deleteHandler = async (id: number) => {
		setConfirmQuestion("guest.deleteConfirm");
		setConfirmColor("error");
		setConfirmButtonText("common.delete");
		setConfirmCallback(() => async () => {
			await deleteGuest(id);
			setReloadTimestamp(Date.now());
		});
		setConfirmOpen(true);
		closeMenu();
	};

	const editHandler = (guest: GuestData) => {
		const handleSubmit = async (values: GuestFormData) => {
			const submitData: UpdateGuestPayload = {
				firstName: values.firstName,
				lastName: values.lastName,
				email: values.email,
				phoneNumber: values.phoneNumber,
				homeCountry: values.homeCountry
					? (values.homeCountry.value as string)
					: undefined,
				type: values.type,
				active: values.active,
				guestTagIds:
					values.guestTagIds?.map((option) => option.value as number) || [],
			};

			const res = await putGuest(guest.id, submitData);
			if (!res.error) {
				setReloadTimestamp(Date.now());
				setFormModalOpen(false);
			}
		};

		const guestTags =
			loadableGuestTags.state === "hasData" ? loadableGuestTags.data : [];
		const guestTagOptions = guestTags
			.filter((tag) => tag.active !== false)
			.map((tag) => ({
				label: tag.tagName,
				value: tag.id,
			}));

		const countries =
			loadableCountries.state === "hasData" ? loadableCountries.data : [];

		const dynamicConfig: FormConfig = {
			...guestFormConfig,
			homeCountry: {
				label: "Home Country",
				type: "autocomplete",
				defaultValue: null,
				options: countries,
				multiple: false,
				validation: {
					required: false,
				},
			},
			guestTagIds: {
				label: "Guest Tags",
				type: "autocomplete",
				defaultValue: [],
				options: guestTagOptions,
				multiple: true,
				validation: {
					required: false,
				},
			},
		};

		const selectedTags = guest.guestTags
			? guest.guestTags.map((tag) => ({
				label: tag.tagName,
				value: tag.id,
			}))
			: [];

		const selectedCountry = guest.homeCountry
			? { label: guest.homeCountry, value: guest.homeCountry }
			: null;

		setFormModalTitle(t("guest.editTitle"));
		setFormModalConfig(dynamicConfig);
		setFormModalInitialValues({
			firstName: guest.firstName,
			lastName: guest.lastName,
			email: guest.email,
			phoneNumber: guest.phoneNumber,
			homeCountry: selectedCountry,
			type: guest.type,
			active: guest.active ?? true,
			guestTagIds: selectedTags,
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
			disabled={!hasPermission(["Admin", "Receptionist"])}
			table={table}
		/>,
		<MRT_ActionMenuItem
			icon={<Delete color="error" />}
			key={t("common.delete")}
			label={t("common.delete")}
			onClick={() => {
				deleteHandler(row.original.id);
			}}
			disabled={!hasPermission(["Admin", "Receptionist"])}
			table={table}
		/>,
	];
};

export default GuestRowActions;
