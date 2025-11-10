import type { FormValues } from "../lib/form";

export interface VatData {
	id: number;
	percentage: number;
	name: string;
}

export interface VatFormData extends FormValues {
	percentage: number;
	name: string;
}
