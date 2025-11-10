import { useSetAtom } from "jotai";
import {
	bookingFilterAtom,
	guestFilterAtom,
	roomFilterAtom,
	roomTypeFilterAtom,
} from "../state/filterState";
import { selectedInvoiceIdAtom } from "../state/invoice";

export const useResetFilters = () => {
	const setRoomFilter = useSetAtom(roomFilterAtom);
	const setGuestFilter = useSetAtom(guestFilterAtom);
	const setRoomTypeFilter = useSetAtom(roomTypeFilterAtom);
	const setSelectedInvoiceId = useSetAtom(selectedInvoiceIdAtom);
	const setBookingFilter = useSetAtom(bookingFilterAtom);

	return () => {
		setRoomFilter(null);
		setGuestFilter(null);
		setRoomTypeFilter(null);
		setSelectedInvoiceId(null);
		setBookingFilter(null);
	};
};
