import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { getInvoices } from "../api/invoiceApi";
import type { InvoiceData } from "../interfaces/invoice";
import type { FormState } from "../lib/form";
import { reloadTimestampAtom } from "./common";

const InvoiceAtom = atom<Promise<InvoiceData[]>>(async (get) => {
	get(reloadTimestampAtom);
	return await getInvoices();
});

const InvoiceAtomById = atom<Promise<InvoiceData | null>>(async (get) => {
	get(reloadTimestampAtom);
	const id = get(selectedInvoiceIdAtom);

	if (id === null) {
		return null;
	}
	return await getInvoices(id).then((invoices) => {
		return invoices.length > 0 ? invoices[0] : null;
	});
});

const selectedInvoiceIdAtom = atom<number | null>(null);
const LoadableInvoiceAtom = loadable<Promise<InvoiceData[]>>(InvoiceAtom);
const LoadableInvoiceAtomById =
	loadable<Promise<InvoiceData | null>>(InvoiceAtomById);
const invoiceFormAtom = atom<FormState>({
	values: {},
	errors: {},
	touched: {},
});

export {
	LoadableInvoiceAtom,
	LoadableInvoiceAtomById,
	invoiceFormAtom,
	selectedInvoiceIdAtom,
};
