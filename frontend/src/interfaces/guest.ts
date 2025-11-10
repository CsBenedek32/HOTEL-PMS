import type { FieldOption, FormValues } from "../lib/form";
import type { GuestType } from "./enums";
import type { GuestTagData } from "./guestTag";

export interface GuestData {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	homeCountry?: string;
	type: GuestType;
	createdAt: Date;
	updatedAt?: Date;
	active?: boolean;
	guestTags?: GuestTagData[];
}

export interface GuestFormData extends FormValues {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	homeCountry?: FieldOption;
	type: GuestType;
	active: boolean;
	guestTagIds?: FieldOption[];
}

export interface CreateGuestPayload {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	homeCountry?: string;
	type: GuestType;
	active: boolean;
	guestTagIds?: number[];
}

export interface UpdateGuestPayload {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	homeCountry?: string;
	type: GuestType;
	active: boolean;
	guestTagIds?: number[];
}
