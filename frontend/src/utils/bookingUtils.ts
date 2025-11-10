import { postBooking, putBooking } from "../api/bookingApi";
import type {
	CreateBookingPayload,
	UpdateBookingPayload,
} from "../interfaces/booking";
import type { FormValues } from "../lib/form";

export const validateBookingBaseData = (
	values: FormValues,
): { [key: string]: string } => {
	const errors: { [key: string]: string } = {};

	const checkInDate = values.checkInDate as Date;
	const checkOutDate = values.checkOutDate as Date;

	if (checkInDate && checkOutDate && checkOutDate <= checkInDate) {
		errors.checkOutDate = "Check-out date must be after check-in date";
	}

	return errors;
};

export const handleBookingSubmit = async (allData: {
	baseData: FormValues;
	guests: FormValues;
	rooms: FormValues;
}) => {
	const checkInDate = allData.baseData.checkInDate as Date;
	const checkOutDate = allData.baseData.checkOutDate as Date;

	const payload: CreateBookingPayload = {
		name: allData.baseData.name as string,
		checkInDate: [
			checkInDate.getFullYear(),
			checkInDate.getMonth() + 1,
			checkInDate.getDate(),
		],
		checkOutDate: [
			checkOutDate.getFullYear(),
			checkOutDate.getMonth() + 1,
			checkOutDate.getDate(),
		],
		description: allData.baseData.description as string | undefined,
		guestIds: (allData.guests.guestIds as number[]) || [],
		roomIds: (allData.rooms.roomIds as number[]) || [],
	};

	return await postBooking(payload);
};

export const handleBookingEdit = async (
	bookingId: number,
	allData: {
		baseData: FormValues;
		guests: FormValues;
		rooms: FormValues;
	},
) => {
	const checkInDate = allData.baseData.checkInDate as Date;
	const checkOutDate = allData.baseData.checkOutDate as Date;

	const payload: UpdateBookingPayload = {
		name: allData.baseData.name as string,
		checkInDate: [
			checkInDate.getFullYear(),
			checkInDate.getMonth() + 1,
			checkInDate.getDate(),
		],
		checkOutDate: [
			checkOutDate.getFullYear(),
			checkOutDate.getMonth() + 1,
			checkOutDate.getDate(),
		],
		description: allData.baseData.description as string | undefined,
		guestIds: (allData.guests.guestIds as number[]) || [],
		roomIds: (allData.rooms.roomIds as number[]) || [],
	};

	return await putBooking(bookingId, payload);
};
