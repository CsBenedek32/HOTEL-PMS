import type { FieldOption, FormValues } from "../lib/form";
import type { AmenityData } from "./amenity";
import type { BedTypeData } from "./bedType";

export interface RoomTypeBedTypeData {
	id: number;
	numBed: number;
	bedType: BedTypeData;
}

export interface RoomTypeData {
	id: number;
	typeName: string;
	price: number;
	capacity: number;
	createdAt: Date;
	updatedAt?: Date;
	amenities: AmenityData[];
	bedTypes: RoomTypeBedTypeData[];
}

export interface BedTypeQuantity {
	bedTypeId: number;
	numBed: number;
}

export interface RoomTypeFormData extends FormValues {
	typeName: string;
	price: number;
	capacity: number;
	amenityIds: FieldOption[];
	bedTypes: BedTypeQuantity[];
}

export interface CreateRoomTypePayload {
	typeName: string;
	price: number;
	capacity: number;
	amenityIds?: number[];
	bedTypes?: BedTypeQuantity[];
}

export interface UpdateRoomTypePayload {
	typeName: string;
	price: number;
	capacity: number;
	amenityIds?: number[];
	bedTypes?: BedTypeQuantity[];
}
