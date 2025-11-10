import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { getBookings } from "../api/bookingApi";
import type { BookingData } from "../interfaces/booking";
import type { FormState } from "../lib/form";
import { reloadTimestampAtom } from "./common";

const BookingAtom = atom<Promise<BookingData[]>>(async (get) => {
	get(reloadTimestampAtom);
	return await getBookings();
});

const LoadableBookingAtom = loadable<Promise<BookingData[]>>(BookingAtom);

export const bookingFormAtom = atom<FormState>({
	values: {},
	errors: {},
	touched: {},
});

export const selectedBookingAtom = atom<BookingData | null>(null);
export const bookingInfoDrawerAtom = atom<boolean>(false);

export { LoadableBookingAtom };
