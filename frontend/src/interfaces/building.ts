import type { FormValues } from "../lib/form";

export interface BuildingData {
	id: number;
	name: string;
	address: string;
	city: string;
	zipcode: string;
	description?: string;
	country: string;
	phoneNumber: string;
	email: string;
	createdAt: Date;
	updatedAt?: Date;
	active?: boolean;
	userIds?: number[];
	roomIds?: number[];
}

export interface BuildingFormData extends FormValues {
	name: string;
	address: string;
	city: string;
	zipcode: string;
	country: string;
	phoneNumber: string;
	email: string;
	description: string;
	active: boolean;
}
