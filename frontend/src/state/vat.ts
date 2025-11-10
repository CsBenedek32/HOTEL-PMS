import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { getVats } from "../api/vatApi";
import type { VatData } from "../interfaces/vat";
import type { FormState } from "../lib/form";
import { reloadTimestampAtom } from "./common";

const VatAtom = atom<Promise<VatData[]>>(async (get) => {
	get(reloadTimestampAtom);
	return await getVats();
});

const LoadableVatAtom = loadable<Promise<VatData[]>>(VatAtom);

export const vatFormAtom = atom<FormState>({
	values: {},
	errors: {},
	touched: {},
});

export const selectedVatAtom = atom<VatData | null>(null);
export const vatInfoDrawerAtom = atom<boolean>(false);

export { LoadableVatAtom };
