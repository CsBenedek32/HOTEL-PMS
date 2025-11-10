import type { FormValues } from "../lib/form";

export interface AmenityData {
	id: number;
	amenityName: string;
	createdAt: Date;
	updatedAt?: Date;
}

export interface AmenityFormData extends FormValues {
	amenityName: string;
}
