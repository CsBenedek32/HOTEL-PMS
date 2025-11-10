import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { getBuildings } from "../api/buildingApi";
import type { BuildingData } from "../interfaces/building";
import type { FormState } from "../lib/form";
import { reloadTimestampAtom } from "./common";

const BuildingAtom = atom<Promise<BuildingData[]>>(async (get) => {
	get(reloadTimestampAtom);
	return await getBuildings();
});

const buildingInfoDrawerAtom = atom<boolean>(false);
const selectedBuildingAtom = atom<BuildingData | null>(null);
const LoadableBuildingAtom = loadable<Promise<BuildingData[]>>(BuildingAtom);
const buildingFormAtom = atom<FormState>({
	values: {},
	errors: {},
	touched: {},
});

export {
	LoadableBuildingAtom,
	buildingFormAtom,
	buildingInfoDrawerAtom,
	selectedBuildingAtom,
};
