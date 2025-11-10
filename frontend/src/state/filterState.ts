import { atom } from "jotai";
import type {
	BookingFilter,
	GuestFilter,
	RoomFilter,
	RoomTypeFilter,
} from "../interfaces/filter";

export const roomFilterAtom = atom<RoomFilter | null>(null);
export const guestFilterAtom = atom<GuestFilter | null>(null);
export const bookingFilterAtom = atom<BookingFilter | null>(null);
export const roomTypeFilterAtom = atom<RoomTypeFilter | null>(null);
