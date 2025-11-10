import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { getRoomTypes } from "../api/roomTypeApi";
import type { RoomTypeData } from "../interfaces/roomType";
import type { FormState } from "../lib/form";
import { reloadTimestampAtom } from "./common";

const RoomTypeAtom = atom<Promise<RoomTypeData[]>>(async (get) => {
	get(reloadTimestampAtom);
	return await getRoomTypes();
});

const LoadableRoomTypeAtom = loadable<Promise<RoomTypeData[]>>(RoomTypeAtom);

export const roomTypeFormAtom = atom<FormState>({
	values: {},
	errors: {},
	touched: {},
});

export const selectedRoomTypeAtom = atom<RoomTypeData | null>(null);
export const roomTypeInfoDrawerAtom = atom<boolean>(false);

export { LoadableRoomTypeAtom };
