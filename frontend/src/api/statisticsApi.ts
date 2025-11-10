import type {
	BookingStats,
	GuestStats,
	HousekeepingStats,
	IncomeStats,
	OccupancyStats,
	RoomAvailabilityStats,
} from "../interfaces/statistics";
import { formatDatesInResponse } from "../utils/dateUtils";
import { apiCall } from "./api";

const apiPrefix: string = "api/statistics";

export const getBookingStatistics = async (): Promise<
	BookingStats | undefined
> => {
	const res = await apiCall<BookingStats>({
		method: "get",
		endpoint: `${apiPrefix}/bookings`,
		fallbackValue: undefined,
		showAlert: false,
	});

	if (res.data) {
		res.data = formatDatesInResponse(res.data, ["date"]) as BookingStats;
	}
	return res.data;
};

export const getGuestStatistics = async (): Promise<GuestStats | undefined> => {
	const res = await apiCall<GuestStats>({
		method: "get",
		endpoint: `${apiPrefix}/guests`,
		fallbackValue: undefined,
		showAlert: false,
	});

	if (res.data) {
		res.data = formatDatesInResponse(res.data, ["date"]) as GuestStats;
	}
	return res.data;
};

export const getHousekeepingStatistics = async (): Promise<
	HousekeepingStats | undefined
> => {
	const res = await apiCall<HousekeepingStats>({
		method: "get",
		endpoint: `${apiPrefix}/housekeeping`,
		fallbackValue: undefined,
		showAlert: false,
	});

	if (res.data) {
		res.data = formatDatesInResponse(res.data, ["date"]) as HousekeepingStats;
	}
	return res.data;
};

export const getRoomAvailabilityStatistics = async (): Promise<
	RoomAvailabilityStats | undefined
> => {
	const res = await apiCall<RoomAvailabilityStats>({
		method: "get",
		endpoint: `${apiPrefix}/room-availability`,
		fallbackValue: undefined,
		showAlert: false,
	});

	if (res.data) {
		res.data = formatDatesInResponse(res.data, [
			"date",
		]) as RoomAvailabilityStats;
	}
	return res.data;
};

export const getIncomeStatistics = async (
	startDate: Date,
	endDate: Date,
): Promise<IncomeStats | undefined> => {
	const startDateStr = startDate.toISOString().split("T")[0];
	const endDateStr = endDate.toISOString().split("T")[0];

	const res = await apiCall<IncomeStats>({
		method: "get",
		endpoint: `${apiPrefix}/income?startDate=${startDateStr}&endDate=${endDateStr}`,
		fallbackValue: undefined,
		showAlert: false,
	});

	if (res.data) {
		res.data = formatDatesInResponse(res.data, [
			"startDate",
			"endDate",
		]) as IncomeStats;
	}
	return res.data;
};

export const getOccupancyStatistics = async (
	startDate: Date,
	endDate: Date,
): Promise<OccupancyStats | undefined> => {
	const startDateStr = startDate.toISOString().split("T")[0];
	const endDateStr = endDate.toISOString().split("T")[0];

	const res = await apiCall<OccupancyStats>({
		method: "get",
		endpoint: `${apiPrefix}/occupancy?startDate=${startDateStr}&endDate=${endDateStr}`,
		fallbackValue: undefined,
		showAlert: false,
	});

	if (res.data) {
		res.data = formatDatesInResponse(res.data, [
			"startDate",
			"endDate",
		]) as OccupancyStats;
	}
	return res.data;
};
