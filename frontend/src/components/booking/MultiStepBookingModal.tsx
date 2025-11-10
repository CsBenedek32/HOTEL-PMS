import {
	Box,
	Breadcrumbs,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	Link,
	Stack,
	Typography,
} from "@mui/material";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonUI from "../../lib/ButtonUi";
import type { FormConfig, FormErrors, FormValues } from "../../lib/form";
import { FormFactory } from "../../lib/form/FormFactory";
import { hasErrors, validateForm } from "../../lib/form/validation";
import {
	type BookingModalStep,
	bookingModalCurrentStepAtom,
	bookingModalEditingIdAtom,
	bookingModalFormDataAtom,
	bookingModalIsEditModeAtom,
	bookingModalOpenAtom,
	resetBookingModalAtom,
} from "../../state/multiStepBookingModal";
import { validateBookingBaseData } from "../../utils/bookingUtils";
import { BookingGuestsStep } from "./BookingGuestsStep";
import { BookingRoomsStep } from "./BookingRoomsStep";

interface MultiStepBookingModalProps {
	baseDataConfig: FormConfig;
	guestsConfig: FormConfig;
	roomsConfig: FormConfig;
	onSubmit: (allData: {
		baseData: FormValues;
		guests: FormValues;
		rooms: FormValues;
	}) => Promise<void>;
	onEdit?: (
		bookingId: number,
		allData: {
			baseData: FormValues;
			guests: FormValues;
			rooms: FormValues;
		},
	) => Promise<void>;
}

const steps: { key: BookingModalStep; label: string }[] = [
	{ key: "baseData", label: "booking.steps.baseData" },
	{ key: "guests", label: "booking.steps.guests" },
	{ key: "rooms", label: "booking.steps.rooms" },
];

export const MultiStepBookingModal = ({
	baseDataConfig,
	guestsConfig,
	roomsConfig,
	onSubmit,
	onEdit,
}: MultiStepBookingModalProps) => {
	const { t } = useTranslation();
	const [open] = useAtom(bookingModalOpenAtom);
	const [currentStep, setCurrentStep] = useAtom(bookingModalCurrentStepAtom);
	const [formData, setFormData] = useAtom(bookingModalFormDataAtom);
	const isEditMode = useAtomValue(bookingModalIsEditModeAtom);
	const editingBookingId = useAtomValue(bookingModalEditingIdAtom);
	const resetModal = useSetAtom(resetBookingModalAtom);

	const valuesRef = useRef<FormValues>({});
	const [errors, setErrors] = useState<FormErrors>({});

	const getCurrentConfig = (): FormConfig => {
		switch (currentStep) {
			case "baseData":
				return baseDataConfig;
			case "guests":
				return guestsConfig;
			case "rooms":
				return roomsConfig;
		}
	};

	const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

	const handleClose = () => {
		resetModal();
	};

	const handleNext = () => {
		const config = getCurrentConfig();
		const validationErrors = validateForm(valuesRef.current, config);

		let crossFieldErrors = {};
		if (currentStep === "baseData") {
			crossFieldErrors = validateBookingBaseData(valuesRef.current);
		}

		const allErrors = { ...validationErrors, ...crossFieldErrors };
		setErrors(allErrors);

		if (!hasErrors(allErrors)) {
			setFormData({
				...formData,
				[currentStep]: valuesRef.current,
			});
			if (currentStepIndex < steps.length - 1) {
				const nextStep = steps[currentStepIndex + 1].key;
				setCurrentStep(nextStep);
				setErrors({});
			}
		}
	};

	const handleBack = () => {
		setFormData({
			...formData,
			[currentStep]: valuesRef.current,
		});

		if (currentStepIndex > 0) {
			const prevStep = steps[currentStepIndex - 1].key;
			setCurrentStep(prevStep);
			setErrors({});
		}
	};

	const handleSubmit = async () => {
		const config = getCurrentConfig();
		const validationErrors = validateForm(valuesRef.current, config);
		setErrors(validationErrors);

		if (!hasErrors(validationErrors)) {
			const finalFormData = {
				...formData,
				[currentStep]: valuesRef.current,
			};

			if (isEditMode && editingBookingId && onEdit) {
				await onEdit(editingBookingId, {
					baseData: finalFormData.baseData as FormValues,
					guests: finalFormData.guests as FormValues,
					rooms: finalFormData.rooms as FormValues,
				});
			} else {
				await onSubmit({
					baseData: finalFormData.baseData as FormValues,
					guests: finalFormData.guests as FormValues,
					rooms: finalFormData.rooms as FormValues,
				});
			}

			resetModal();
		}
	};

	const handleBreadcrumbClick = (stepKey: BookingModalStep) => {
		const targetIndex = steps.findIndex((s) => s.key === stepKey);
		if (targetIndex <= currentStepIndex) {
			setFormData({
				...formData,
				[currentStep]: valuesRef.current,
			});
			setCurrentStep(stepKey);
			setErrors({});
		}
	};

	useEffect(() => {
		if (open) {
			valuesRef.current = { ...formData[currentStep] } as FormValues;
			setErrors({});
		}
	}, [currentStep, open, formData[currentStep]]);

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="lg"
			fullWidth
			slotProps={{
				paper: {
					sx: {
						borderRadius: 3,
						height: "80vh",
					},
				},
			}}
		>
			<Typography sx={{ fontWeight: "bold", padding: 2 }} variant="h5">
				{isEditMode ? t("booking.editTitle") : t("booking.createTitle")}
			</Typography>

			{/* Breadcrumbs */}
			<Box sx={{ paddingX: 2, paddingBottom: 2 }}>
				<Breadcrumbs aria-label="booking steps">
					{steps.map((step, index) => {
						const isActive = step.key === currentStep;
						const isCompleted = index < currentStepIndex;
						const isAccessible = index <= currentStepIndex;

						return (
							<Link
								key={step.key}
								component="button"
								variant="body1"
								onClick={() => handleBreadcrumbClick(step.key)}
								underline={isActive ? "always" : "hover"}
								sx={{
									color: isActive
										? "primary.main"
										: isCompleted
											? "success.main"
											: isAccessible
												? "text.primary"
												: "text.disabled",
									fontWeight: isActive ? "bold" : "normal",
									cursor: isAccessible ? "pointer" : "default",
									pointerEvents: isAccessible ? "auto" : "none",
								}}
							>
								{t(step.label)}
							</Link>
						);
					})}
				</Breadcrumbs>
			</Box>

			{/* Form Content */}
			<DialogContent>
				<Box sx={{ minHeight: "300px" }}>
					{currentStep === "guests" ? (
						<BookingGuestsStep
							selectedGuestIds={(valuesRef.current.guestIds as number[]) || []}
							onGuestSelectionChange={(guestIds) => {
								valuesRef.current.guestIds = guestIds;
							}}
						/>
					) : currentStep === "rooms" ? (
						<BookingRoomsStep
							checkInDate={formData.baseData.checkInDate as Date}
							checkOutDate={formData.baseData.checkOutDate as Date}
							selectedRoomIds={(valuesRef.current.roomIds as number[]) || []}
							onRoomSelectionChange={(roomIds) => {
								valuesRef.current.roomIds = roomIds;
							}}
							excludeBookingId={isEditMode ? editingBookingId : undefined}
						/>
					) : (
						<FormFactory
							config={getCurrentConfig()}
							initialValues={formData[currentStep]}
							valuesRef={valuesRef}
							errors={errors}
						/>
					)}
				</Box>
			</DialogContent>

			{/* Actions */}
			<DialogActions>
				<Stack
					direction="row"
					spacing={2}
					sx={{ padding: 1, flexGrow: 1, justifyContent: "space-between" }}
				>
					<Stack direction="row" spacing={2}>
						<Button
							onClick={handleClose}
							color="secondary"
							sx={{ minWidth: 120 }}
							variant="outlined"
						>
							{t("common.cancel")}
						</Button>
						{currentStepIndex > 0 && (
							<Button
								onClick={handleBack}
								color="primary"
								sx={{ minWidth: 120 }}
								variant="outlined"
							>
								{t("common.back")}
							</Button>
						)}
					</Stack>

					<Stack direction="row" spacing={2}>
						{currentStepIndex < steps.length - 1 ? (
							<ButtonUI
								label={t("common.next")}
								sx={{ minWidth: 120 }}
								onClick={handleNext}
								color="primary"
								variant="contained"
							/>
						) : (
							<ButtonUI
								label={isEditMode ? t("common.edit") : t("common.create")}
								sx={{ minWidth: 120 }}
								onClick={handleSubmit}
								color="primary"
								variant="contained"
							/>
						)}
					</Stack>
				</Stack>
			</DialogActions>
		</Dialog>
	);
};
