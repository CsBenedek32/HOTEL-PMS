import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { getGuests } from "../api/guestApi";
import type { GuestData } from "../interfaces/guest";
import type { FormState } from "../lib/form";
import { reloadTimestampAtom } from "./common";

const GuestAtom = atom<Promise<GuestData[]>>(async (get) => {
	get(reloadTimestampAtom);
	return await getGuests();
});

const guestInfoDrawerAtom = atom<boolean>(false);
const selectedGuestAtom = atom<GuestData | null>(null);
const LoadableGuestAtom = loadable<Promise<GuestData[]>>(GuestAtom);
const guestFormAtom = atom<FormState>({
	values: {},
	errors: {},
	touched: {},
});

export {
	LoadableGuestAtom,
	guestFormAtom,
	guestInfoDrawerAtom,
	selectedGuestAtom,
};
