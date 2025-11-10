export interface RoomFilter {
	roomId?: number;
	roomNumber?: string;
	buildingId?: number;
	floorNumber?: number;
	status?: string;
}

export interface GuestFilter {
	guestId?: number;
	email?: string;
	phoneNumber?: string;
}

export interface BookingFilter {
	bookingId?: number;
	guestId?: number;
	roomId?: number;
	status?: string;
}

export interface RoomTypeFilter {
	roomTypeId?: number;
}
