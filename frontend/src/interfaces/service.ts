import type { FormValues } from "../lib/form";
import type { VatData } from "./vat";

export interface ServiceData {
	id: number;
	name: string;
	description?: string;
	cost?: number;
	immutable?: boolean;
	createdAt: Date;
	updatedAt?: Date;
	vat?: VatData;
	virtual?: boolean;
}

export interface ServiceFormData extends FormValues {
	name: string;
	description: string;
	cost: number;
	vatId: number;
}
