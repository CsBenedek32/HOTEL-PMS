import WarningIcon from "@mui/icons-material/Warning";
import { Chip } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import type { MRT_ColumnDef } from "material-react-table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { postInvoice, syncInvoiceWithBookings } from "../api/invoiceApi";
import BookingInfo from "../components/booking/BookingInfo";
import BookingRowActions from "../components/booking/BookingRowActions";
import { MultiStepBookingModal } from "../components/booking/MultiStepBookingModal";
import UploadNewBookingBtn from "../components/booking/UploadNewBookingButton";
import {
	bookingBaseDataFormConfig,
	bookingGuestsFormConfig,
	bookingRoomsFormConfig,
} from "../config/forms/bookingForm";
import type { BookingData } from "../interfaces/booking";
import { BookingInvoiceStatus, BookingStatus } from "../interfaces/enums";
import DataTable from "../lib/DataTable";
import type { FormValues } from "../lib/form";
import { bookingInfoDrawerAtom, LoadableBookingAtom } from "../state/booking";
import { reloadTimestampAtom } from "../state/common";
import {
	confirmModalButtonTextAtom,
	confirmModalCallbackAtom,
	confirmModalColorAtom,
	confirmModalOpenAtom,
	confirmModalQuestionAtom,
} from "../state/confirmModal";
import { bookingFilterAtom } from "../state/filterState";
import {
	handleBookingEdit as editBooking,
	handleBookingSubmit as submitBooking,
} from "../utils/bookingUtils";
import { DATE_FORMAT, dateToString } from "../utils/dateUtils";
import {
	getBookingStatusColor,
	getInvoiceStatusColor,
} from "../utils/statusUtils";

function BookingPage() {
	const loadValue = useAtomValue(LoadableBookingAtom);
	const { t } = useTranslation();
	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);
	const navigate = useNavigate();
	const setConfirmModalOpen = useSetAtom(confirmModalOpenAtom);
	const setConfirmModalQuestion = useSetAtom(confirmModalQuestionAtom);
	const setConfirmModalCallback = useSetAtom(confirmModalCallbackAtom);
	const setConfirmModalColor = useSetAtom(confirmModalColorAtom);
	const setConfirmModalButtonText = useSetAtom(confirmModalButtonTextAtom);
	const bookingFilter = useAtomValue(bookingFilterAtom);

	const showInvoiceActionModal = (
		bookingData: BookingData,
		actionType: "create" | "sync",
	) => {
		const question =
			actionType === "create"
				? "booking.confirmCreateInvoice"
				: "booking.confirmSyncInvoice";
		const buttonText =
			actionType === "create" ? "booking.createInvoice" : "booking.syncInvoice";

		setConfirmModalQuestion(question);
		setConfirmModalButtonText(buttonText);
		setConfirmModalColor("primary");
		setConfirmModalCallback(() => async () => {
			if (actionType === "create") {
				const invoiceRes = await postInvoice({
					name: `Invoice for ${bookingData.name}`,
					initialBookingId: bookingData.id,
				});
				if (!invoiceRes.error && invoiceRes.data) {
					setReloadTimestamp(Date.now());
					navigate("/invoice");
				}
			} else {
				if (bookingData.invoiceId) {
					await syncInvoiceWithBookings(bookingData.invoiceId);
					setReloadTimestamp(Date.now());
				}
			}
		});
		setConfirmModalOpen(true);
	};

	const checkInvoiceStatusAndPrompt = (bookingData: BookingData) => {
		if (bookingData.scynStatus === BookingInvoiceStatus.NO_INVOICE) {
			showInvoiceActionModal(bookingData, "create");
		} else if (bookingData.scynStatus === BookingInvoiceStatus.NOT_SYNCED) {
			showInvoiceActionModal(bookingData, "sync");
		}
	};

	const handleBookingSubmit = async (allData: {
		baseData: FormValues;
		guests: FormValues;
		rooms: FormValues;
	}) => {
		const res = await submitBooking(allData);
		if (!res.error && res.data) {
			setReloadTimestamp(Date.now());
			checkInvoiceStatusAndPrompt(res.data);
		}
	};

	const handleBookingEdit = async (
		bookingId: number,
		allData: {
			baseData: FormValues;
			guests: FormValues;
			rooms: FormValues;
		},
	) => {
		const res = await editBooking(bookingId, allData);
		if (!res.error && res.data) {
			setReloadTimestamp(Date.now());
			checkInvoiceStatusAndPrompt(res.data);
		}
	};

	const columns = useMemo<MRT_ColumnDef<BookingData>[]>(
		() => [
			{
				accessorKey: "id",
				header: `${t("booking.bookingId")}`,
			},
			{
				accessorKey: "name",
				header: `${t("booking.name")}`,
			},
			{
				accessorKey: "active",
				header: `${t("booking.active")}`,
				Cell: ({ cell }) => {
					const isActive = cell.getValue<boolean>();
					return (
						<Chip
							label={isActive ? t("common.yes") : t("common.no")}
							color={isActive ? "success" : "default"}
							size="small"
						/>
					);
				},
				filterVariant: "select",
				filterSelectOptions: [
					{ value: true, label: t("common.yes") },
					{ value: false, label: t("common.no") },
				],
			},
			{
				accessorKey: "status",
				header: `${t("booking.status")}`,
				Cell: ({ cell }) => {
					const status = cell.getValue<string>();
					return (
						<Chip
							label={t(`enums.bookingStatus.${status}`)}
							color={getBookingStatusColor(status)}
							size="small"
						/>
					);
				},
				filterVariant: "multi-select",
				filterSelectOptions: Object.values(BookingStatus).map((status) => ({
					label: t(`enums.bookingStatus.${status}`),
					value: status,
				})),
			},
			{
				accessorKey: "scynStatus",
				header: `${t("booking.invoiceStatus")}`,
				Cell: ({ cell }) => {
					const status = cell.getValue<string>();
					return (
						<Chip
							label={t(`enums.bookingInvoiceStatus.${status}`)}
							color={getInvoiceStatusColor(status)}
							size="small"
							icon={
								status === BookingInvoiceStatus.NO_INVOICE ||
								status === BookingInvoiceStatus.NOT_SYNCED ? (
									<WarningIcon />
								) : undefined
							}
						/>
					);
				},
				filterVariant: "multi-select",
				filterSelectOptions: Object.values(BookingInvoiceStatus).map(
					(status) => ({
						label: t(`enums.bookingInvoiceStatus.${status}`),
						value: status,
					}),
				),
			},
			{
				accessorKey: "checkInDate",
				header: `${t("booking.checkInDate")}`,
				Cell: ({ cell }) => dateToString(cell.getValue<Date>(), DATE_FORMAT),
			},
			{
				accessorKey: "checkOutDate",
				header: `${t("booking.checkOutDate")}`,
				Cell: ({ cell }) => dateToString(cell.getValue<Date>(), DATE_FORMAT),
			},
			{
				accessorKey: "rooms",
				header: `${t("booking.rooms")}`,
				Cell: ({ cell }) => {
					const rooms = cell.getValue<BookingData["rooms"]>();
					return rooms
						.map((room) => `${room.floorNumber}-${room.roomNumber}`)
						.join(", ");
				},
			},
			{
				accessorKey: "description",
				header: `${t("booking.description")}`,
			},
			{
				accessorKey: "createdAt",
				header: `${t("booking.createdAt")}`,
				Cell: ({ cell }) => dateToString(cell.getValue<Date>()),
			},
			{
				accessorKey: "updatedAt",
				header: `${t("booking.updatedAt")}`,
				Cell: ({ cell }) => {
					const value = cell.getValue<Date | undefined>();
					return value ? dateToString(value) : "";
				},
			},
		],
		[t],
	);

	const initialColumnFilters = useMemo(() => {
		if (!bookingFilter) return [];

		const filters = [];
		if (bookingFilter.bookingId !== undefined) {
			filters.push({ id: "id", value: bookingFilter.bookingId });
		}

		return filters;
	}, [bookingFilter]);

	return (
		<>
			<DataTable
				columns={columns}
				data={loadValue.state === "hasData" ? loadValue.data : []}
				isLoading={loadValue.state === "loading"}
				renderTopToolbarCustomActions={() => <UploadNewBookingBtn />}
				enableRowActions={true}
				enableColumnFilters={true}
				drawerAtom={bookingInfoDrawerAtom}
				drawerContent={<BookingInfo />}
				renderRowActionMenuItems={({ row, table, closeMenu }) => {
					const myElement = (
						<BookingRowActions row={row} table={table} closeMenu={closeMenu} />
					);
					const reactNodeArray = React.Children.toArray([myElement]);
					return reactNodeArray;
				}}
				defaultHiddenColumns={["createdAt", "updatedAt", "active", "id"]}
				tableOptions={{
					enableFilters: true,
					initialState: {
						density: "compact",
						showColumnFilters: true,
						columnFilters: [
							{ id: "active", value: true },
							...initialColumnFilters,
						],
					},
				}}
			/>
			<MultiStepBookingModal
				baseDataConfig={bookingBaseDataFormConfig}
				guestsConfig={bookingGuestsFormConfig}
				roomsConfig={bookingRoomsFormConfig}
				onSubmit={handleBookingSubmit}
				onEdit={handleBookingEdit}
			/>
		</>
	);
}

export default BookingPage;
