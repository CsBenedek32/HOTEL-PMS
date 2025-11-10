import type { FormValues } from "../lib/form";
import type { BookingInvoiceStatus, BookingStatus, GuestType } from "./enums";
import type { GuestTagData } from "./guestTag";
import type { RoomData } from "./room";

export interface GuestData {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	type: GuestType;
	createdAt: Date;
	updatedAt?: Date;
	active?: boolean;
	guestTags: GuestTagData[];
}

export interface BookingData {
	id: number;
	active: boolean;
	status: BookingStatus;
	scynStatus: BookingInvoiceStatus;
	checkInDate: Date;
	checkOutDate: Date;
	name: string;
	description?: string;
	createdAt: Date;
	updatedAt?: Date;
	invoiceId?: number;
	guests: GuestData[];
	rooms: RoomData[];
}

export interface BookingFormData extends FormValues {
	status: BookingStatus;
	checkInDate: Date;
	checkOutDate: Date;
	name: string;
	description: string;
	guestIds: number[];
	roomIds: number[];
}

export interface CreateBookingPayload {
	checkInDate: number[];
	checkOutDate: number[];
	name: string;
	description?: string;
	guestIds: number[];
	roomIds: number[];
}

export interface UpdateBookingPayload {
	status?: BookingStatus;
	checkInDate?: number[];
	checkOutDate?: number[];
	name?: string;
	description?: string;
	guestIds?: number[];
	roomIds?: number[];
}
