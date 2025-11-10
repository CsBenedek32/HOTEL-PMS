import type { FormValues } from "../lib/form";
import type { HousekeepingPriority, HousekeepingStatus } from "./enums";
import type { RoomData } from "./room";
import type { UserData } from "./user";

export interface HousekeepingData {
	id: number;
	user?: UserData;
	room: RoomData;
	note?: string;
	status: HousekeepingStatus;
	priority: HousekeepingPriority;
	assignedDate?: Date;
	completionDate?: Date;
	createdAt: Date;
	updatedAt?: Date;
}

export interface HousekeepingFormData extends FormValues {
	userId?: number;
	roomId: number;
	note: string;
	priority: HousekeepingPriority;
}

export interface CreateHousekeepingPayload {
	userId?: number;
	roomId: number;
	note: string;
	priority: HousekeepingPriority;
}

export interface UpdateHousekeepingPayload {
	userId?: number;
	roomId: number;
	note: string;
	priority: HousekeepingPriority;
}
