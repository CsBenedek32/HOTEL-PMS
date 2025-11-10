import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { getServices } from "../api/serviceApi";
import type { ServiceData } from "../interfaces/service";
import type { FormState } from "../lib/form";
import { reloadTimestampAtom } from "./common";

const ServiceAtom = atom<Promise<ServiceData[]>>(async (get) => {
	get(reloadTimestampAtom);
	return await getServices();
});

const serviceInfoDrawerAtom = atom<boolean>(false);
const selectedServiceAtom = atom<ServiceData | null>(null);
const LoadableServiceAtom = loadable<Promise<ServiceData[]>>(ServiceAtom);
const serviceFormAtom = atom<FormState>({
	values: {},
	errors: {},
	touched: {},
});

export {
	LoadableServiceAtom,
	serviceFormAtom,
	serviceInfoDrawerAtom,
	selectedServiceAtom,
};
