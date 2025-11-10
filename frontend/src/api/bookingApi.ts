import type { ApiResponse } from "../interfaces/api";
import type {
	BookingData,
	CreateBookingPayload,
	UpdateBookingPayload,
} from "../interfaces/booking";
import { formatDatesInResponse } from "../utils/dateUtils";
import { apiCall } from "./api";

const BOOKING_DATE_FIELDS = [
	"updatedAt",
	"createdAt",
	"checkInDate",
	"checkOutDate",
] as const;
const apiPrefix: string = "api/bookings";

export const getBookings = async (): Promise<BookingData[]> => {
	const res = await apiCall<BookingData[]>({
		method: "get",
		endpoint: apiPrefix,
		fallbackValue: [],
		showAlert: false,
	});

	return formatDatesInResponse(res.data, [
		...BOOKING_DATE_FIELDS,
	]) as BookingData[];
};

export async function postBooking(
	data: CreateBookingPayload,
): Promise<ApiResponse<BookingData | undefined>> {
	const res = await apiCall<BookingData>({
		method: "post",
		endpoint: apiPrefix,
		body: data,
		fallbackValue: undefined,
		showAlert: true,
	});

	if (res.data) {
		res.data = formatDatesInResponse(res.data, [...BOOKING_DATE_FIELDS]);
	}
	return res;
}

export async function putBooking(
	id: number,
	data: UpdateBookingPayload,
): Promise<ApiResponse<BookingData | undefined>> {
	const res = await apiCall<BookingData>({
		method: "put",
		endpoint: `${apiPrefix}/${id}`,
		body: data,
		fallbackValue: undefined,
		showAlert: true,
	});

	if (res.data) {
		res.data = formatDatesInResponse(res.data, [...BOOKING_DATE_FIELDS]);
	}
	return res;
}

export async function deleteBooking(id: number): Promise<null> {
	await apiCall<null>({
		method: "delete",
		endpoint: `${apiPrefix}/${id}`,
		fallbackValue: null,
		showAlert: true,
	});
	return null;
}

export async function patchBookingStatus(
	id: number,
	status: string,
): Promise<ApiResponse<BookingData | undefined>> {
	const res = await apiCall<BookingData>({
		method: "patch",
		endpoint: `${apiPrefix}/${id}/status?status=${status}`,
		fallbackValue: undefined,
		showAlert: true,
	});

	if (res.data) {
		res.data = formatDatesInResponse(res.data, [...BOOKING_DATE_FIELDS]);
	}
	return res;
}
