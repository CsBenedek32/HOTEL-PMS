import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { getGuestTags } from "../api/guestTagApi";
import type { GuestTagData } from "../interfaces/guestTag";
import type { FormState } from "../lib/form";
import { reloadTimestampAtom } from "./common";

const GuestTagAtom = atom<Promise<GuestTagData[]>>(async (get) => {
	get(reloadTimestampAtom);
	return await getGuestTags();
});

const guestTagInfoDrawerAtom = atom<boolean>(false);
const selectedGuestTagAtom = atom<GuestTagData | null>(null);
const LoadableGuestTagAtom = loadable<Promise<GuestTagData[]>>(GuestTagAtom);
const guestTagFormAtom = atom<FormState>({
	values: {},
	errors: {},
	touched: {},
});

export {
	LoadableGuestTagAtom,
	guestTagFormAtom,
	guestTagInfoDrawerAtom,
	selectedGuestTagAtom,
};
