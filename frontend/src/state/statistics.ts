import { atom } from "jotai";
import { loadable } from "jotai/utils";
import {
	getBookingStatistics,
	getGuestStatistics,
	getHousekeepingStatistics,
	getIncomeStatistics,
	getOccupancyStatistics,
	getRoomAvailabilityStatistics,
} from "../api/statisticsApi";
import type {
	BookingStats,
	GuestStats,
	HousekeepingStats,
	IncomeStats,
	OccupancyStats,
	RoomAvailabilityStats,
} from "../interfaces/statistics";
import { reloadTimestampAtom } from "./common";

const getDefaultStartDate = () => {
	const date = new Date();
	date.setDate(date.getDate() - 7);
	return date;
};

const getDefaultEndDate = () => new Date();

export const incomeStartDateAtom = atom<Date>(getDefaultStartDate());
export const incomeEndDateAtom = atom<Date>(getDefaultEndDate());
export const occupancyStartDateAtom = atom<Date>(getDefaultStartDate());
export const occupancyEndDateAtom = atom<Date>(getDefaultEndDate());

const BookingStatsAtom = atom<Promise<BookingStats | undefined>>(
	async (get) => {
		get(reloadTimestampAtom);
		return await getBookingStatistics();
	},
);

const GuestStatsAtom = atom<Promise<GuestStats | undefined>>(async (get) => {
	get(reloadTimestampAtom);
	return await getGuestStatistics();
});

const HousekeepingStatsAtom = atom<Promise<HousekeepingStats | undefined>>(
	async (get) => {
		get(reloadTimestampAtom);
		return await getHousekeepingStatistics();
	},
);

const RoomAvailabilityStatsAtom = atom<
	Promise<RoomAvailabilityStats | undefined>
>(async (get) => {
	get(reloadTimestampAtom);
	return await getRoomAvailabilityStatistics();
});

const IncomeStatsAtom = atom<Promise<IncomeStats | undefined>>(async (get) => {
	get(reloadTimestampAtom);
	const startDate = get(incomeStartDateAtom);
	const endDate = get(incomeEndDateAtom);
	return await getIncomeStatistics(startDate, endDate);
});

const OccupancyStatsAtom = atom<Promise<OccupancyStats | undefined>>(
	async (get) => {
		get(reloadTimestampAtom);
		const startDate = get(occupancyStartDateAtom);
		const endDate = get(occupancyEndDateAtom);
		return await getOccupancyStatistics(startDate, endDate);
	},
);

export const LoadableBookingStatsAtom =
	loadable<Promise<BookingStats | undefined>>(BookingStatsAtom);

export const LoadableGuestStatsAtom =
	loadable<Promise<GuestStats | undefined>>(GuestStatsAtom);

export const LoadableHousekeepingStatsAtom = loadable<
	Promise<HousekeepingStats | undefined>
>(HousekeepingStatsAtom);

export const LoadableRoomAvailabilityStatsAtom = loadable<
	Promise<RoomAvailabilityStats | undefined>
>(RoomAvailabilityStatsAtom);

export const LoadableIncomeStatsAtom =
	loadable<Promise<IncomeStats | undefined>>(IncomeStatsAtom);

export const LoadableOccupancyStatsAtom =
	loadable<Promise<OccupancyStats | undefined>>(OccupancyStatsAtom);
