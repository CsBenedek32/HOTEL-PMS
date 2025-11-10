import type { FieldOption, FormValues } from "../lib/form";
import type { RoleData } from "./role";

export interface User {
	email: string;
	roles: string[];
}

export interface UserData {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	createdAt: Date;
	updatedAt?: Date;
	active?: boolean;
	roles?: RoleData[];
}

export interface RegisterFormData {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	password: string;
	confirmPassword: string;
}

export interface UserFormData extends FormValues {
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	password: string;
	roleIds: FieldOption[];
}

export interface UpdateUserPayload {
	firstName: string;
	lastName: string;
	phone: string;
	roleIds: number[];
}
