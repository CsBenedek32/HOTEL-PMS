import type { BookingData } from "./booking";
import type { RoomData } from "./room";

export interface RoomMirrorData extends RoomData {
	bookings: BookingData[];
}

export interface RoomMirrorParams {
	buildingId: number;
	startDate: string;
	endDate: string;
}
