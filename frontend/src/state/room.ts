import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { getRooms } from "../api/roomApi";
import type { RoomData } from "../interfaces/room";
import type { FormState } from "../lib/form";
import { reloadTimestampAtom } from "./common";

const RoomAtom = atom<Promise<RoomData[]>>(async (get) => {
	get(reloadTimestampAtom);
	return await getRooms();
});

const LoadableRoomAtom = loadable<Promise<RoomData[]>>(RoomAtom);

export const roomFormAtom = atom<FormState>({
	values: {},
	errors: {},
	touched: {},
});

export const selectedRoomAtom = atom<RoomData | null>(null);
export const roomInfoDrawerAtom = atom<boolean>(false);

export { LoadableRoomAtom };
