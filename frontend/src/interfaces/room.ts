import type { FormValues } from "../lib/form";
import type { BuildingData } from "./building";
import type { RoomStatus } from "./enums";
import type { RoomTypeData } from "./roomType";

export interface RoomData {
	id: number;
	status: RoomStatus;
	description?: string;
	roomNumber: string;
	floorNumber: number;
	createdAt: Date;
	updatedAt?: Date;
	roomType: RoomTypeData;
	building: BuildingData;
}

export interface RoomFormData extends FormValues {
	status: RoomStatus;
	description: string;
	roomNumber: string;
	floorNumber: number;
	roomTypeId: number;
	buildingId: number;
}

export interface CreateRoomPayload {
	status: RoomStatus;
	description?: string;
	roomNumber: string;
	floorNumber: number;
	roomTypeId: number;
	buildingId: number;
}

export interface UpdateRoomPayload {
	status: RoomStatus;
	description?: string;
	roomNumber: string;
	floorNumber: number;
	roomTypeId?: number;
	buildingId?: number;
}
