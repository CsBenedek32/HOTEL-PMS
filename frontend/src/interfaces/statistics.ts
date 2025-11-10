export interface BookingStats {
	totalNumberOfBookings: number;
	countByStatus: Record<string, number>;
	date: Date;
}

export interface DailyIncomeStats {
	totalSum: number;
	numberOfInvoices: number;
	invoiceIds: number[];
}

export interface IncomeStats {
	startDate: Date;
	endDate: Date;
	dailyStats: Record<string, DailyIncomeStats>;
}

export interface DailyOccupancyStats {
	occupied: number;
	available: number;
	occupancyRate: number;
}

export interface OccupancyStats {
	startDate: Date;
	endDate: Date;
	maxCapacity: number;
	dailyStats: Record<string, DailyOccupancyStats>;
}

export interface CountryGuestStats {
	totalGuests: number;
	adults: number;
	children: number;
}

export interface GuestStats {
	totalGuests: number;
	totalAdults: number;
	totalChildren: number;
	guestsByCountry: Record<string, CountryGuestStats>;
	date: Date;
}

export interface RoomTypeAvailability {
	totalRooms: number;
	available: number;
	reserved: number;
	unavailable: number;
}

export interface RoomAvailabilityStats {
	date: Date;
	availabilityByRoomType: Record<string, RoomTypeAvailability>;
}

export interface HousekeepingStats {
	totalRooms: number;
	cleanRooms: number;
	dirtyRooms: number;
	outOfServiceRooms: number;
	date: Date;
}
