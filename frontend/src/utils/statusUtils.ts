import {
	BookingInvoiceStatus,
	BookingStatus,
	HousekeepingPriority,
	HousekeepingStatus,
	PaymentStatus,
	RoomStatus,
} from "../interfaces/enums";

export const getRoomStatusColor = (
	status: string,
): "success" | "warning" | "error" | "default" => {
	switch (status) {
		case RoomStatus.CLEAN:
			return "success";
		case RoomStatus.DIRTY:
			return "warning";
		case RoomStatus.OUT_OF_SERVICE:
			return "error";
		default:
			return "default";
	}
};

export const getActiveStatusColor = (active: boolean): "success" | "error" => {
	return active ? "success" : "error";
};

export const getBookingStatusColor = (
	status: string,
):
	| "success"
	| "warning"
	| "error"
	| "info"
	| "default"
	| "primary"
	| "secondary" => {
	switch (status) {
		case BookingStatus.CHECKED_IN:
			return "success";
		case BookingStatus.RESERVED:
			return "info";
		case BookingStatus.CHECKED_OUT:
			return "primary";
		case BookingStatus.CANCELLED:
			return "error";
		case BookingStatus.NO_SHOW:
			return "secondary";
		case BookingStatus.WAITLISTED:
			return "warning";
		case BookingStatus.BLOCKED:
			return "default";
		default:
			return "default";
	}
};

export const getInvoiceStatusColor = (
	status: string,
): "success" | "warning" | "error" | "default" => {
	switch (status) {
		case BookingInvoiceStatus.SYNCED:
			return "success";
		case BookingInvoiceStatus.NOT_SYNCED:
			return "warning";
		case BookingInvoiceStatus.NO_INVOICE:
			return "error";
		default:
			return "default";
	}
};

export const getPaymentStatusColor = (
	status: string,
): "success" | "warning" | "error" | "default" => {
	switch (status) {
		case PaymentStatus.FULFILLED:
			return "success";
		case PaymentStatus.PENDING:
			return "warning";
		case PaymentStatus.CANCELLED:
			return "error";
		default:
			return "default";
	}
};

export const getHousekeepingStatusColor = (
	status: string,
): "success" | "primary" | "default" => {
	switch (status) {
		case HousekeepingStatus.TO_DO:
			return "default";
		case HousekeepingStatus.IN_PROGRESS:
			return "primary";
		case HousekeepingStatus.DONE:
			return "success";
		default:
			return "default";
	}
};

export const getHousekeepingPriorityColor = (
	priority: string,
): "error" | "warning" | "info" | "default" => {
	switch (priority) {
		case HousekeepingPriority.LOW:
			return "default";
		case HousekeepingPriority.MEDIUM:
			return "info";
		case HousekeepingPriority.HIGH:
			return "warning";
		case HousekeepingPriority.URGENT:
			return "error";
		default:
			return "default";
	}
};
