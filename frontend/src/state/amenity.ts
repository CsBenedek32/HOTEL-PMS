import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { getAmenities } from "../api/amenityApi";
import type { AmenityData } from "../interfaces/amenity";
import { reloadTimestampAtom } from "./common";

const AmenityAtom = atom<Promise<AmenityData[]>>(async (get) => {
	get(reloadTimestampAtom);
	return await getAmenities();
});

export const selectedAmenityAtom = atom<AmenityData | null>(null);
export const amenityInfoDrawerAtom = atom<boolean>(false);

export const LoadableAmenityAtom =
	loadable<Promise<AmenityData[]>>(AmenityAtom);
