import { Upload } from "@mui/icons-material";
import { useAtomValue, useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { postGuest } from "../../api/guestApi";
import { guestFormConfig } from "../../config/forms/guestForm";
import { GuestType } from "../../interfaces/enums";
import type { CreateGuestPayload, GuestFormData } from "../../interfaces/guest";
import ButtonUI from "../../lib/ButtonUi";
import type { FormConfig, FormValues } from "../../lib/form";
import { reloadTimestampAtom } from "../../state/common";
import { LoadableCountriesAtom } from "../../state/countries";
import {
	formModalConfigAtom,
	formModalInitialValuesAtom,
	formModalOnSubmitAtom,
	formModalOpenAtom,
	formModalTitleAtom,
} from "../../state/formModal";
import { LoadableGuestTagAtom } from "../../state/guestTag";

const UploadNewGuestBtn = () => {
	const { t } = useTranslation();
	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);
	const setFormModalOpen = useSetAtom(formModalOpenAtom);
	const setTitle = useSetAtom(formModalTitleAtom);
	const setConfig = useSetAtom(formModalConfigAtom);
	const setInitialValues = useSetAtom(formModalInitialValuesAtom);
	const setOnSubmit = useSetAtom(formModalOnSubmitAtom);
	const loadableGuestTags = useAtomValue(LoadableGuestTagAtom);
	const loadableCountries = useAtomValue(LoadableCountriesAtom);

	const handleSubmit = async (values: GuestFormData) => {
		const submitData: CreateGuestPayload = {
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

		const res = await postGuest(submitData);
		if (!res.error) {
			setReloadTimestamp(Date.now());
			setFormModalOpen(false);
		}
	};

	const handleClick = () => {
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
					required: true,
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

		setTitle(t("guest.uploadTitle"));
		setConfig(dynamicConfig);
		setInitialValues({ type: GuestType.ADULT });
		setOnSubmit(() => handleSubmit as (values: FormValues) => Promise<void>);
		setFormModalOpen(true);
	};

	return (
		<ButtonUI
			color="primary"
			startIcon={<Upload />}
			label={t("guest.upload")}
			onClick={handleClick}
			requiredPermissions={["Admin", "Receptionist"]}
			variant="contained"
		/>
	);
};

export default UploadNewGuestBtn;
