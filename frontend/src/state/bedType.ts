import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { getBedTypes } from "../api/bedTypeApi";
import type { BedTypeData } from "../interfaces/bedType";
import type { FormState } from "../lib/form";
import { reloadTimestampAtom } from "./common";

const BedTypeAtom = atom<Promise<BedTypeData[]>>(async (get) => {
	get(reloadTimestampAtom);
	return await getBedTypes();
});

const LoadableBedTypeAtom = loadable<Promise<BedTypeData[]>>(BedTypeAtom);

export const bedTypeFormAtom = atom<FormState>({
	values: {},
	errors: {},
	touched: {},
});

export const selectedBedTypeAtom = atom<BedTypeData | null>(null);
export const bedTypeInfoDrawerAtom = atom<boolean>(false);

export { LoadableBedTypeAtom };
