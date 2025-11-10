import {
	CalendarToday,
	ChangeCircle,
	CheckCircle,
	Edit,
	EventNote,
	MeetingRoom,
	People,
	Receipt,
} from "@mui/icons-material";
import {
	Box,
	Card,
	CardContent,
	Chip,
	Divider,
	Grid,
	IconButton,
	Stack,
	Typography,
} from "@mui/material";
import { useAtom, useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { putBooking } from "../../api/bookingApi";
import type { UpdateBookingPayload } from "../../interfaces/booking";
import { BookingStatus } from "../../interfaces/enums";
import type { FormValues } from "../../lib/form";
import {
	bookingInfoDrawerAtom,
	selectedBookingAtom,
} from "../../state/booking";
import { reloadTimestampAtom } from "../../state/common";
import { guestFilterAtom, roomFilterAtom } from "../../state/filterState";
import {
	formModalConfigAtom,
	formModalInitialValuesAtom,
	formModalOnSubmitAtom,
	formModalOpenAtom,
	formModalTitleAtom,
} from "../../state/formModal";
import { openBookingModalForEditAtom } from "../../state/multiStepBookingModal";
import { dateToString } from "../../utils/dateUtils";
import {
	getBookingStatusColor,
	getInvoiceStatusColor,
	getRoomStatusColor,
} from "../../utils/statusUtils";
import {
	DetailsSection,
	InfoSection,
	MetadataSection,
} from "../common/InfoDrawerComponents";

const BookingInfo = () => {
	const { t } = useTranslation();
	const [selectedBooking, setSelectedBooking] = useAtom(selectedBookingAtom);
	const setBookingInfoDrawer = useSetAtom(bookingInfoDrawerAtom);
	const setRoomFilter = useSetAtom(roomFilterAtom);
	const setGuestFilter = useSetAtom(guestFilterAtom);
	const navigate = useNavigate();
	const openBookingModalForEdit = useSetAtom(openBookingModalForEditAtom);
	const setFormModalOpen = useSetAtom(formModalOpenAtom);
	const setFormModalTitle = useSetAtom(formModalTitleAtom);
	const setFormModalConfig = useSetAtom(formModalConfigAtom);
	const setFormModalInitialValues = useSetAtom(formModalInitialValuesAtom);
	const setFormModalOnSubmit = useSetAtom(formModalOnSubmitAtom);
	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);

	const handleEdit = () => {
		if (!selectedBooking) return;
		openBookingModalForEdit({
			bookingId: selectedBooking.id,
			formData: {
				baseData: {
					name: selectedBooking.name,
					checkInDate: selectedBooking.checkInDate,
					checkOutDate: selectedBooking.checkOutDate,
					description: selectedBooking.description || "",
				},
				guests: {
					guestIds: selectedBooking.guests.map((g) => g.id),
				},
				rooms: {
					roomIds: selectedBooking.rooms.map((r) => r.id),
				},
			},
		});
		setBookingInfoDrawer(false);
	};

	const handleChangeStatus = () => {
		if (!selectedBooking) return;

		const statusFormConfig = {
			status: {
				label: "booking.status",
				type: "select" as const,
				defaultValue: selectedBooking.status,
				options: Object.values(BookingStatus).map((status) => ({
					label: t(`enums.bookingStatus.${status}`),
					value: status,
				})),
				validation: {
					required: true,
				},
			},
		};

		const handleSubmit = async (values: FormValues) => {
			const checkInDate = new Date(selectedBooking.checkInDate);
			const checkOutDate = new Date(selectedBooking.checkOutDate);

			const fullBookingData: UpdateBookingPayload = {
				status: values.status as BookingStatus,
				checkInDate: [
					checkInDate.getFullYear(),
					checkInDate.getMonth() + 1,
					checkInDate.getDate(),
				],
				checkOutDate: [
					checkOutDate.getFullYear(),
					checkOutDate.getMonth() + 1,
					checkOutDate.getDate(),
				],
				name: selectedBooking.name,
				description: selectedBooking.description,
				guestIds: selectedBooking.guests.map((g) => g.id),
				roomIds: selectedBooking.rooms.map((r) => r.id),
			};
			const res = await putBooking(selectedBooking.id, fullBookingData);
			if (!res.error) {
				setReloadTimestamp(Date.now());
				setFormModalOpen(false);
			}
		};

		setFormModalTitle(t("booking.changeStatus"));
		setFormModalConfig(statusFormConfig);
		setFormModalInitialValues({ status: selectedBooking.status });
		setFormModalOnSubmit(
			() => handleSubmit as (values: FormValues) => Promise<void>,
		);
		setFormModalOpen(true);
		setBookingInfoDrawer(false);
	};

	if (!selectedBooking) {
		return (
			<Box p={3}>
				<Typography variant="h6" color="text.secondary">
					{t("booking.noBookingSelected")}
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ width: "100%", height: "100%", overflow: "auto", p: 3 }}>
			<Stack spacing={3}>
				<Box display="flex" justifyContent="space-between" alignItems="center">
					<Box>
						<Box display="flex" alignItems="center" gap={2} mb={1}>
							<EventNote fontSize="large" color="primary" />
							<Typography variant="h4" fontWeight={600}>
								{selectedBooking.name}
							</Typography>
						</Box>
						<Box display="flex" gap={1} alignItems="center">
							<Chip
								label={t(`enums.bookingStatus.${selectedBooking.status}`)}
								color={getBookingStatusColor(selectedBooking.status)}
								size="small"
							/>
							<Chip
								label={t(
									`enums.bookingInvoiceStatus.${selectedBooking.scynStatus}`,
								)}
								color={getInvoiceStatusColor(selectedBooking.scynStatus)}
								size="small"
							/>
							<Typography variant="caption" color="text.secondary">
								{t("common.created")} {dateToString(selectedBooking.createdAt)}
							</Typography>
						</Box>
					</Box>
					<Box display="flex" gap={1}>
						<IconButton color="primary" onClick={handleEdit}>
							<Edit />
						</IconButton>
						<IconButton color="warning" onClick={handleChangeStatus}>
							<ChangeCircle />
						</IconButton>
					</Box>
				</Box>

				<Divider />

				{/* Booking Details */}
				<DetailsSection
					title={t("booking.bookingDetails")}
					details={[
						{
							icon: <CalendarToday />,
							label: t("booking.checkInDate"),
							value: dateToString(selectedBooking.checkInDate),
						},
						{
							icon: <CalendarToday />,
							label: t("booking.checkOutDate"),
							value: dateToString(selectedBooking.checkOutDate),
						},
						{
							icon: <CheckCircle />,
							label: t("booking.status"),
							value: t(`enums.bookingStatus.${selectedBooking.status}`),
						},
						{
							icon: <Receipt />,
							label: t("booking.invoiceStatus"),
							value: t(
								`enums.bookingInvoiceStatus.${selectedBooking.scynStatus}`,
							),
						},
					]}
				/>

				<InfoSection
					title={t("booking.invoice")}
					icon={<Receipt color="primary" />}
					headerAction={
						!selectedBooking.invoiceId && (
							<Chip label={t("booking.noInvoice")} size="small" color="error" />
						)
					}
					sx={{
						opacity: selectedBooking.invoiceId ? 1 : 0.6,
						pointerEvents: selectedBooking.invoiceId ? "auto" : "none",
					}}
				>
					{selectedBooking.invoiceId ? (
						<Grid container spacing={2}>
							<Grid size={{ xs: 12, sm: 6 }}>
								<Typography variant="caption" color="text.secondary">
									{t("booking.invoiceId")}
								</Typography>
								<Typography variant="body2" fontFamily="monospace">
									{selectedBooking.invoiceId}
								</Typography>
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<Typography variant="caption" color="text.secondary">
									{t("booking.syncStatus")}
								</Typography>
								<Box mt={0.5}>
									<Chip
										label={t(
											`enums.bookingInvoiceStatus.${selectedBooking.scynStatus}`,
										)}
										color={getInvoiceStatusColor(selectedBooking.scynStatus)}
										size="small"
									/>
								</Box>
							</Grid>
						</Grid>
					) : (
						<Typography variant="body2" color="text.secondary">
							{t("booking.noInvoiceCreated")}
						</Typography>
					)}
				</InfoSection>

				<InfoSection
					title={t("booking.guests")}
					icon={<People color="primary" />}
					headerAction={
						<Chip
							label={selectedBooking.guests.length}
							size="small"
							color="primary"
						/>
					}
				>
					{selectedBooking.guests.length > 0 ? (
						<Stack spacing={1.5}>
							{selectedBooking.guests.map((guest) => (
								<Card
									key={guest.id}
									variant="outlined"
									sx={{
										bgcolor: "background.default",
										transition: "all 0.2s",
										"&:hover": {
											bgcolor: "action.hover",
											transform: "translateX(4px)",
										},
									}}
								>
									<CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
										<Box
											display="flex"
											justifyContent="space-between"
											alignItems="center"
											onClick={() => {
												setGuestFilter({ guestId: guest.id });
												setSelectedBooking(null);
												setBookingInfoDrawer(false);
												navigate("/guest");
											}}
										>
											<Box>
												<Typography variant="body1" fontWeight={600}>
													{guest.firstName} {guest.lastName}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													{guest.email}
												</Typography>
												<Typography variant="caption" color="text.secondary">
													{guest.phoneNumber}
												</Typography>
											</Box>
											<Box>
												<Chip
													label={t(`enums.guestType.${guest.type}`)}
													size="small"
													color={guest.type === "ADULT" ? "primary" : "default"}
												/>
											</Box>
										</Box>
										{guest.guestTags && guest.guestTags.length > 0 && (
											<Box mt={1} display="flex" gap={0.5} flexWrap="wrap">
												{guest.guestTags.map((tag) => (
													<Chip
														key={tag.id}
														label={tag.tagName}
														size="small"
														variant="outlined"
													/>
												))}
											</Box>
										)}
									</CardContent>
								</Card>
							))}
						</Stack>
					) : (
						<Typography variant="body2" color="text.secondary">
							{t("booking.noGuestsAssigned")}
						</Typography>
					)}
				</InfoSection>

				<InfoSection
					title={t("booking.rooms")}
					icon={<MeetingRoom color="primary" />}
					headerAction={
						<Chip
							label={selectedBooking.rooms.length}
							size="small"
							color="primary"
						/>
					}
				>
					{selectedBooking.rooms.length > 0 ? (
						<Box>
							<Grid container spacing={1}>
								{selectedBooking.rooms.map((room) => (
									<Grid size={{ xs: 6, sm: 4, md: 3 }} key={room.id}>
										<Card
											variant="outlined"
											sx={{
												bgcolor: "background.default",
												transition: "all 0.2s",
												cursor: "pointer",
												"&:hover": {
													bgcolor: "action.hover",
													transform: "translateY(-2px)",
													boxShadow: 1,
												},
											}}
											onClick={() => {
												setRoomFilter({ roomId: room.id });
												setSelectedBooking(null);
												setBookingInfoDrawer(false);
												navigate("/room");
											}}
										>
											<CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
												<Typography variant="body2" fontWeight={600}>
													{room.roomNumber}
												</Typography>
												<Typography variant="caption" color="text.secondary">
													{t("room.floorNumber")} {room.floorNumber}
												</Typography>
												<Box mt={0.5}>
													<Chip
														label={t(`enums.roomStatus.${room.status}`)}
														size="small"
														color={getRoomStatusColor(room.status)}
													/>
												</Box>
											</CardContent>
										</Card>
									</Grid>
								))}
							</Grid>
						</Box>
					) : (
						<Typography variant="body2" color="text.secondary">
							{t("booking.noRoomsAssigned")}
						</Typography>
					)}
				</InfoSection>

				{selectedBooking.description && (
					<InfoSection title={t("booking.description")}>
						<Typography variant="body2" color="text.secondary">
							{selectedBooking.description}
						</Typography>
					</InfoSection>
				)}

				<MetadataSection
					fields={[
						{
							label: t("booking.createdAt"),
							value: dateToString(selectedBooking.createdAt),
						},
						{
							label: t("booking.lastUpdated"),
							value: selectedBooking.updatedAt
								? dateToString(selectedBooking.updatedAt)
								: undefined,
							hide: !selectedBooking.updatedAt,
						},
						{
							label: t("booking.bookingId"),
							value: selectedBooking.id,
							monospace: true,
						},
						{
							label: t("booking.active"),
							value: selectedBooking.active ? t("common.yes") : t("common.no"),
						},
					]}
				/>
			</Stack>
		</Box>
	);
};

export default BookingInfo;
