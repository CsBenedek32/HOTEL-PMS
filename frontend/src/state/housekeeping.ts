import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { getHousekeeping } from "../api/housekeepingApi";
import type { HousekeepingData } from "../interfaces/housekeeping";
import type { FormState } from "../lib/form";
import { reloadTimestampAtom } from "./common";

const HousekeepingAtom = atom<Promise<HousekeepingData[]>>(async (get) => {
	get(reloadTimestampAtom);
	return await getHousekeeping();
});

const LoadableHousekeepingAtom =
	loadable<Promise<HousekeepingData[]>>(HousekeepingAtom);

export const housekeepingFormAtom = atom<FormState>({
	values: {},
	errors: {},
	touched: {},
});

export const selectedHousekeepingAtom = atom<HousekeepingData | null>(null);
export const housekeepingInfoDrawerAtom = atom<boolean>(false);

export { LoadableHousekeepingAtom };
