import type { FormValues } from "../lib/form";

export interface GuestTagData {
	id: number;
	tagName: string;
	createdAt: Date;
	updatedAt?: Date;
	active?: boolean;
}

export interface GuestTagFormData extends FormValues {
	tagName: string;
	active: boolean;
}
