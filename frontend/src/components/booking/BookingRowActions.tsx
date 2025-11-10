import {
	Add,
	ChangeCircle,
	Delete,
	Edit,
	Info,
	Receipt,
	Sync,
} from "@mui/icons-material";
import { useSetAtom } from "jotai";
import {
	MRT_ActionMenuItem,
	type MRT_Row,
	type MRT_TableInstance,
} from "material-react-table";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { deleteBooking, putBooking } from "../../api/bookingApi";
import { postInvoice, syncInvoiceWithBookings } from "../../api/invoiceApi";
import type {
	BookingData,
	UpdateBookingPayload,
} from "../../interfaces/booking";
import { BookingInvoiceStatus, BookingStatus } from "../../interfaces/enums";
import type { FormValues } from "../../lib/form";
import {
	bookingInfoDrawerAtom,
	selectedBookingAtom,
} from "../../state/booking";
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
import { selectedInvoiceIdAtom } from "../../state/invoice";
import { openBookingModalForEditAtom } from "../../state/multiStepBookingModal";
import { hasPermission } from "../../utils/permissions";

interface BookingRowActionsProps {
	row: MRT_Row<BookingData>;
	table: MRT_TableInstance<BookingData>;
	closeMenu: () => void;
}

const BookingRowActions = ({
	row,
	table,
	closeMenu,
}: BookingRowActionsProps) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);
	const setConfirmOpen = useSetAtom(confirmModalOpenAtom);
	const setConfirmQuestion = useSetAtom(confirmModalQuestionAtom);
	const setConfirmCallback = useSetAtom(confirmModalCallbackAtom);
	const setConfirmColor = useSetAtom(confirmModalColorAtom);
	const setConfirmButtonText = useSetAtom(confirmModalButtonTextAtom);
	const setSelectedBooking = useSetAtom(selectedBookingAtom);
	const setBookingInfoDrawer = useSetAtom(bookingInfoDrawerAtom);
	const openBookingModalForEdit = useSetAtom(openBookingModalForEditAtom);
	const setFormModalOpen = useSetAtom(formModalOpenAtom);
	const setFormModalTitle = useSetAtom(formModalTitleAtom);
	const setFormModalConfig = useSetAtom(formModalConfigAtom);
	const setFormModalInitialValues = useSetAtom(formModalInitialValuesAtom);
	const setFormModalOnSubmit = useSetAtom(formModalOnSubmitAtom);
	const setSelectedInvoiceId = useSetAtom(selectedInvoiceIdAtom);

	const deleteHandler = async (id: number) => {
		setConfirmQuestion("booking.deleteConfirm");
		setConfirmColor("error");
		setConfirmButtonText("common.delete");
		setConfirmCallback(() => async () => {
			await deleteBooking(id);
			setReloadTimestamp(Date.now());
		});
		setConfirmOpen(true);
		closeMenu();
	};

	const editHandler = (booking: BookingData) => {
		openBookingModalForEdit({
			bookingId: booking.id,
			formData: {
				baseData: {
					name: booking.name,
					checkInDate: booking.checkInDate,
					checkOutDate: booking.checkOutDate,
					description: booking.description || "",
				},
				guests: {
					guestIds: booking.guests.map((g) => g.id),
				},
				rooms: {
					roomIds: booking.rooms.map((r) => r.id),
				},
			},
		});
		closeMenu();
	};

	const openInfoDrawer = (booking: BookingData) => {
		setSelectedBooking(booking);
		setBookingInfoDrawer(true);
		closeMenu();
	};

	const changeStatusHandler = (booking: BookingData) => {
		const statusFormConfig = {
			status: {
				label: "booking.status",
				type: "select" as const,
				defaultValue: booking.status,
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
			const checkInDate = new Date(booking.checkInDate);
			const checkOutDate = new Date(booking.checkOutDate);

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
				name: booking.name,
				description: booking.description,
				guestIds: booking.guests.map((g) => g.id),
				roomIds: booking.rooms.map((r) => r.id),
			};
			const res = await putBooking(booking.id, fullBookingData);
			if (!res.error) {
				setReloadTimestamp(Date.now());
				setFormModalOpen(false);
			}
		};

		setFormModalTitle(t("booking.changeStatus"));
		setFormModalConfig(statusFormConfig);
		setFormModalInitialValues({ status: booking.status });
		setFormModalOnSubmit(
			() => handleSubmit as (values: FormValues) => Promise<void>,
		);
		setFormModalOpen(true);
		closeMenu();
	};

	const syncInvoiceHandler = async (booking: BookingData) => {
		if (!booking.invoiceId) {
			return;
		}
		await syncInvoiceWithBookings(booking.invoiceId);
		setReloadTimestamp(Date.now());
		closeMenu();

		const invoiceId = booking.invoiceId;
		setConfirmQuestion("booking.confirmViewInvoice");
		setConfirmColor("primary");
		setConfirmButtonText("booking.viewInvoice");
		setConfirmCallback(() => () => {
			setSelectedInvoiceId(invoiceId);
			navigate("/invoice");
		});
		setConfirmOpen(true);
	};

	const createInvoiceHandler = async (booking: BookingData) => {
		const invoiceRes = await postInvoice({
			name: `Invoice for ${booking.name}`,
			initialBookingId: booking.id,
		});
		if (!invoiceRes.error && invoiceRes.data) {
			setReloadTimestamp(Date.now());
			closeMenu();

			const invoiceId = invoiceRes.data.id;
			setConfirmQuestion("booking.confirmViewInvoice");
			setConfirmColor("primary");
			setConfirmButtonText("booking.viewInvoice");
			setConfirmCallback(() => () => {
				setSelectedInvoiceId(invoiceId);
				navigate("/invoice");
			});
			setConfirmOpen(true);
		} else {
			closeMenu();
		}
	};

	const viewInvoiceHandler = (booking: BookingData) => {
		if (booking.invoiceId) {
			setSelectedInvoiceId(booking.invoiceId);
			navigate("/invoice");
		}
		closeMenu();
	};

	const hasInvoice =
		row.original.invoiceId &&
		row.original.scynStatus !== BookingInvoiceStatus.NO_INVOICE;

	const noInvoice = row.original.scynStatus === BookingInvoiceStatus.NO_INVOICE;

	return [
		<MRT_ActionMenuItem
			icon={<Info color="success" />}
			key={t("common.info")}
			label={t("common.info")}
			onClick={() => {
				openInfoDrawer(row.original);
			}}
			disabled={!hasPermission(["Admin", "Receptionist"])}
			table={table}
		/>,
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
			icon={<ChangeCircle color="warning" />}
			key={t("booking.changeStatus")}
			label={t("booking.changeStatus")}
			onClick={() => changeStatusHandler(row.original)}
			disabled={!hasPermission(["Admin", "Receptionist"])}
			table={table}
		/>,
		...(noInvoice
			? [
				<MRT_ActionMenuItem
					icon={<Add color="success" />}
					key={t("booking.createInvoice")}
					label={t("booking.createInvoice")}
					onClick={() => createInvoiceHandler(row.original)}
					disabled={!hasPermission(["Admin", "Receptionist"])}
					table={table}
				/>,
			]
			: []),
		...(hasInvoice
			? [
				<MRT_ActionMenuItem
					icon={<Sync color="info" />}
					key={t("booking.syncInvoice")}
					label={t("booking.syncInvoice")}
					onClick={() => syncInvoiceHandler(row.original)}
					disabled={!hasPermission(["Admin", "Receptionist"])}
					table={table}
				/>,
				<MRT_ActionMenuItem
					icon={<Receipt color="primary" />}
					key={t("booking.viewInvoice")}
					label={t("booking.viewInvoice")}
					onClick={() => viewInvoiceHandler(row.original)}
					disabled={!hasPermission(["Admin", "Receptionist"])}
					table={table}
				/>,
			]
			: []),
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

export default BookingRowActions;
