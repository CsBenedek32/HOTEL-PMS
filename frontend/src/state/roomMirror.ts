import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { getRoomMirror } from "../api/roomApi";
import type { RoomMirrorData } from "../interfaces/roomMirror";
import { reloadTimestampAtom } from "./common";

const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

const oneYearFromNow = new Date();
oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

export const selectedBuildingIdAtom = atom<number | null>(null);

const RoomMirrorAtom = atom<Promise<RoomMirrorData[]>>(async (get) => {
	get(reloadTimestampAtom);
	const buildingId = get(selectedBuildingIdAtom);

	if (buildingId === null) {
		return [];
	}

	return await getRoomMirror({
		buildingId,
		startDate: oneYearAgo.toISOString().split("T")[0],
		endDate: oneYearFromNow.toISOString().split("T")[0],
	});
});

export const LoadableRoomMirrorAtom =
	loadable<Promise<RoomMirrorData[]>>(RoomMirrorAtom);
