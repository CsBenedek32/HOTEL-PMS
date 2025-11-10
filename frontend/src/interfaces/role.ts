import type { FormValues } from "../lib/form";

export interface RoleData {
	id: number;
	name: string;
	createdAt: Date;
	updatedAt?: Date;
	active?: boolean;
	immutable: boolean;
}

export interface RoleFormData extends FormValues {
	name: string;
}
