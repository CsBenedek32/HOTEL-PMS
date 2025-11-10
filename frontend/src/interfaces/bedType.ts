import type { FormValues } from "../lib/form";

export interface BedTypeData {
	id: number;
	bedTypeName: string;
	createdAt: Date;
	updatedAt?: Date;
}

export interface BedTypeFormData extends FormValues {
	bedTypeName: string;
}
