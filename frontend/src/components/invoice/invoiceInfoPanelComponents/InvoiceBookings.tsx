import { Add, Close, EventNote } from "@mui/icons-material";
import {
	Box,
	Card,
	CardContent,
	Chip,
	Grid,
	IconButton,
	Typography,
} from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import {
	addBookingToInvoice,
	removeBookingFromInvoice,
} from "../../../api/invoiceApi";
import type { BookingData } from "../../../interfaces/booking";
import type { FormValues } from "../../../lib/form";
import { LoadableBookingAtom } from "../../../state/booking";
import { reloadTimestampAtom } from "../../../state/common";
import {
	confirmModalButtonTextAtom,
	confirmModalCallbackAtom,
	confirmModalOpenAtom,
	confirmModalQuestionAtom,
} from "../../../state/confirmModal";
import { bookingFilterAtom } from "../../../state/filterState";
import {
	formModalConfigAtom,
	formModalInitialValuesAtom,
	formModalOnSubmitAtom,
	formModalOpenAtom,
	formModalTitleAtom,
} from "../../../state/formModal";
import { selectedInvoiceIdAtom } from "../../../state/invoice";
import { DATE_FORMAT, dateToString } from "../../../utils/dateUtils";
import { getBookingStatusColor } from "../../../utils/statusUtils";
import { InfoSection } from "../../common/InfoDrawerComponents";
import { hasPermission } from "../../../utils/permissions";

interface InvoiceBookingsProps {
	bookings: BookingData[];
}

const InvoiceBookings = ({ bookings }: InvoiceBookingsProps) => {
	const { t } = useTranslation();
	const invoiceId = useAtomValue(selectedInvoiceIdAtom);
	const allBookings = useAtomValue(LoadableBookingAtom);
	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);
	const setConfirmOpen = useSetAtom(confirmModalOpenAtom);
	const setConfirmQuestion = useSetAtom(confirmModalQuestionAtom);
	const setConfirmCallback = useSetAtom(confirmModalCallbackAtom);
	const setConfirmButtonText = useSetAtom(confirmModalButtonTextAtom);
	const setFormModalOpen = useSetAtom(formModalOpenAtom);
	const setFormModalTitle = useSetAtom(formModalTitleAtom);
	const setFormModalConfig = useSetAtom(formModalConfigAtom);
	const setFormModalInitialValues = useSetAtom(formModalInitialValuesAtom);
	const setFormModalOnSubmit = useSetAtom(formModalOnSubmitAtom);
	const setBookingFilter = useSetAtom(bookingFilterAtom);
	const navigate = useNavigate();

	const availableBookings = useMemo(() => {
		if (allBookings.state !== "hasData") return [];
		const currentBookingIds = bookings.map((b) => b.id);
		return allBookings.data
			.filter(
				(b) =>
					!currentBookingIds.includes(b.id) && b.scynStatus === "NO_INVOICE",
			)
			.map((b) => ({
				value: b.id,
				label: `${b.name} (${dateToString(b.checkInDate, DATE_FORMAT)} - ${dateToString(b.checkOutDate, DATE_FORMAT)})`,
			}));
	}, [allBookings, bookings]);

	const handleAddBooking = () => {
		setFormModalTitle(t("invoice.addBooking"));
		setFormModalConfig({
			bookingId: {
				label: t("booking.name"),
				type: "select",
				defaultValue: "",
				validation: {
					required: true,
				},
				options: availableBookings,
			},
		});
		setFormModalInitialValues({});
		setFormModalOnSubmit(() => async (values: FormValues) => {
			try {
				if (invoiceId && values.bookingId) {
					await addBookingToInvoice(invoiceId, values.bookingId as number);
					setReloadTimestamp(Date.now());
					setFormModalOpen(false);
				}
			} catch (error) {
				console.log("Failed to add booking:", error);
			}
		});
		setFormModalOpen(true);
	};

	const handleRemoveBooking = (bookingId: number, bookingName: string) => {
		setConfirmQuestion(t("invoice.removeBooking", { bookingName }));
		setConfirmButtonText(t("common.delete"));

		setConfirmCallback(() => async () => {
			try {
				if (invoiceId) {
					await removeBookingFromInvoice(invoiceId, bookingId);
					setReloadTimestamp(Date.now());
				}
			} catch (error) {
				console.log("Failed to remove booking:", error);
			}
		});
		setConfirmOpen(true);
	};

	return (
		<InfoSection
			title={t("invoice.bookings")}
			icon={<EventNote color="primary" />}
			headerAction={
				<Chip label={bookings.length} size="small" color="primary" />
			}
		>
			<Grid container spacing={1}>
				{bookings.map((booking) => (
					<Grid size={{ xs: 6, sm: 4, md: 3 }} key={booking.id}>
						<Card
							variant="outlined"
							sx={{
								bgcolor: "background.default",
								transition: "all 0.2s",
								cursor: "pointer",
								position: "relative",
								height: 120,
								"&:hover": {
									bgcolor: "action.hover",
									transform: "translateY(-2px)",
									boxShadow: 1,
								},
								"&:hover .remove-button": {
									opacity: 1,
								},
							}}
							onClick={() => {
								setBookingFilter({ bookingId: booking.id });
								navigate(`/booking`);
							}}
						>
							<IconButton
								className="remove-button"
								size="small"
								disabled={!hasPermission(["Admin", "Invoice Manager"])}
								onClick={(e) => {
									e.stopPropagation();
									handleRemoveBooking(booking.id, booking.name);
								}}
								sx={{
									position: "absolute",
									top: 4,
									right: 4,
									opacity: 0,
									transition: "opacity 0.2s",
									bgcolor: "background.paper",
									"&:hover": {
										bgcolor: "error.main",
										color: "white",
									},
								}}
							>
								<Close fontSize="small" />
							</IconButton>
							<CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
								<Typography variant="body2" fontWeight={600} noWrap>
									{booking.name}
								</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
									display="block"
								>
									{dateToString(booking.checkInDate)} -{" "}
									{dateToString(booking.checkOutDate)}
								</Typography>
								<Box mt={0.5}>
									<Chip
										label={booking.status}
										size="small"
										color={getBookingStatusColor(booking.status)}
									/>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				))}
				{hasPermission(["Admin", "Invoice Manager"]) && (<Grid size={{ xs: 6, sm: 4, md: 3 }}>
					<Card
						variant="outlined"
						sx={{
							bgcolor: "background.default",
							transition: "all 0.2s",
							cursor: "pointer",
							border: "2px dashed",
							borderColor: "primary.main",
							height: 120,
							"&:hover": {
								bgcolor: "action.hover",
								transform: "translateY(-2px)",
								boxShadow: 1,
								borderColor: "primary.dark",
							},
						}}
						onClick={handleAddBooking}

					>
						<CardContent
							sx={{
								p: 1.5,
								"&:last-child": { pb: 1.5 },
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								height: "100%",
							}}
						>
							<Add fontSize="large" color="primary" />
							<Typography variant="caption" color="primary" fontWeight={600}>
								{t("invoice.addBooking")}
							</Typography>
						</CardContent>
					</Card>
				</Grid>)}
			</Grid>
		</InfoSection>
	);
};

export default InvoiceBookings;
