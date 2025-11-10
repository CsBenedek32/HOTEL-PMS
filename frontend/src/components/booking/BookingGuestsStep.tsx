import {
	Autocomplete,
	Box,
	Chip,
	createFilterOptions,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { postGuest } from "../../api/guestApi";
import { guestFormConfig } from "../../config/forms/guestForm";
import { GuestType } from "../../interfaces/enums";
import type {
	CreateGuestPayload,
	GuestData,
	GuestFormData,
} from "../../interfaces/guest";
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
import { LoadableGuestAtom } from "../../state/guest";
import { LoadableGuestTagAtom } from "../../state/guestTag";

interface GuestOptionType extends GuestData {
	inputValue?: string;
}

const filter = createFilterOptions<GuestOptionType>();

interface BookingGuestsStepProps {
	selectedGuestIds: number[];
	onGuestSelectionChange: (guestIds: number[]) => void;
}

export const BookingGuestsStep = ({
	selectedGuestIds,
	onGuestSelectionChange,
}: BookingGuestsStepProps) => {
	const { t } = useTranslation();
	const loadableGuests = useAtomValue(LoadableGuestAtom);
	const loadableGuestTags = useAtomValue(LoadableGuestTagAtom);
	const loadableCountries = useAtomValue(LoadableCountriesAtom);
	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);
	const setFormModalOpen = useSetAtom(formModalOpenAtom);
	const setTitle = useSetAtom(formModalTitleAtom);
	const setConfig = useSetAtom(formModalConfigAtom);
	const setInitialValues = useSetAtom(formModalInitialValuesAtom);
	const setOnSubmit = useSetAtom(formModalOnSubmitAtom);

	const [selectedGuests, setSelectedGuests] = useState<GuestOptionType[]>([]);

	const guests: GuestOptionType[] =
		loadableGuests.state === "hasData" ? loadableGuests.data : [];

	useEffect(() => {
		const guestsToSelect = guests.filter((guest) =>
			selectedGuestIds.includes(guest.id),
		);
		setSelectedGuests(guestsToSelect);
	}, [selectedGuestIds, guests]);

	const openGuestFormModal = (initialEmail?: string) => {
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
			if (!res.error && res.data) {
				setReloadTimestamp(Date.now());
				setFormModalOpen(false);
				const newGuest = res.data;
				const updatedGuests = [...selectedGuests, newGuest];
				setSelectedGuests(updatedGuests);
				onGuestSelectionChange(updatedGuests.map((guest) => guest.id));
			}
		};

		setTitle(t("guest.uploadTitle"));
		setConfig(dynamicConfig);
		setInitialValues({
			type: GuestType.ADULT,
			email: initialEmail || "",
		});
		setOnSubmit(() => handleSubmit as (values: FormValues) => Promise<void>);
		setFormModalOpen(true);
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
			<Typography variant="h6">{t("booking.steps.guests")}</Typography>

			<Stack spacing={2}>
				<Autocomplete
					multiple
					id={useId()}
					options={guests}
					value={selectedGuests}
					onChange={(_event, newValue) => {
						if (Array.isArray(newValue)) {
							const addNewOption = newValue.find(
								(option) => typeof option === "string",
							);
							if (addNewOption) {
								setTimeout(() => {
									openGuestFormModal(
										typeof addNewOption === "string" ? addNewOption : "",
									);
								});
								return;
							}
							const hasInputValue = newValue.find(
								(option) =>
									typeof option === "object" && option.inputValue !== undefined,
							);
							if (hasInputValue && typeof hasInputValue === "object") {
								openGuestFormModal(hasInputValue.inputValue || "");
								return;
							}
						}
						const validGuests = (newValue as GuestOptionType[]).filter(
							(option) => option.id !== undefined,
						);
						setSelectedGuests(validGuests);
						onGuestSelectionChange(validGuests.map((guest) => guest.id));
					}}
					filterOptions={(options, params) => {
						const filtered = filter(options, params);

						const { inputValue } = params;
						const isExisting = options.some(
							(option) =>
								inputValue.toLowerCase() === option.email.toLowerCase(),
						);
						if (inputValue !== "" && !isExisting) {
							filtered.push({
								inputValue,
								email: `${t("booking.addNewGuest")} "${inputValue}"`,
								firstName: "",
								lastName: "",
								phoneNumber: "",
								type: GuestType.ADULT,
								id: -1,
								createdAt: new Date(),
							});
						}

						return filtered;
					}}
					getOptionLabel={(option) => {
						if (typeof option === "string") {
							return option;
						}
						if (option.inputValue) {
							return option.inputValue;
						}
						return `${option.firstName} ${option.lastName} (${option.email})`;
					}}
					isOptionEqualToValue={(option, value) => option.id === value.id}
					loading={loadableGuests.state === "loading"}
					selectOnFocus
					clearOnBlur
					handleHomeEndKeys
					renderInput={(params) => (
						<TextField
							{...params}
							label={t("booking.selectGuests")}
							placeholder={t("booking.selectGuestsPlaceholder")}
							helperText={t("booking.selectGuestsHelper")}
						/>
					)}
					renderTags={(value, getTagProps) =>
						value.map((option, index) => {
							const { key, ...tagProps } = getTagProps({ index });
							return (
								<Chip
									key={key}
									label={`${option.firstName} ${option.lastName}`}
									{...tagProps}
								/>
							);
						})
					}
					renderOption={(props, option) => {
						const { key, ...optionProps } = props;
						if (option.inputValue) {
							return (
								<li key={key} {...optionProps}>
									<Box sx={{ color: "primary.main", fontWeight: "medium" }}>
										<Typography variant="body1">{option.email}</Typography>
									</Box>
								</li>
							);
						}
						return (
							<li key={key} {...optionProps}>
								<Box>
									<Typography variant="body1">
										{option.firstName} {option.lastName}
									</Typography>
									<Typography variant="caption" color="text.secondary">
										{option.email}
									</Typography>
								</Box>
							</li>
						);
					}}
					noOptionsText={
						<Box sx={{ textAlign: "center", py: 1 }}>
							<Typography variant="body2" color="text.secondary">
								{t("booking.noGuestsFound")}
							</Typography>
						</Box>
					}
				/>
			</Stack>
		</Box>
	);
};
