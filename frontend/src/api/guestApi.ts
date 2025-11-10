import type { ApiResponse } from "../interfaces/api";
import type {
	CreateGuestPayload,
	GuestData,
	UpdateGuestPayload,
} from "../interfaces/guest";
import { formatDatesInResponse } from "../utils/dateUtils";
import { apiCall } from "./api";

const apiPrefix: string = "api/guests";

export const getGuests = async (): Promise<GuestData[]> => {
	const res = await apiCall<GuestData[]>({
		method: "get",
		endpoint: apiPrefix,
		fallbackValue: [],
		showAlert: false,
	});

	return formatDatesInResponse(res.data, [
		"updatedAt",
		"createdAt",
	]) as GuestData[];
};

export async function postGuest(
	data: CreateGuestPayload,
): Promise<ApiResponse<GuestData | undefined>> {
	const res = await apiCall<GuestData>({
		method: "post",
		endpoint: apiPrefix,
		body: data,
		fallbackValue: undefined,
		showAlert: true,
	});

	if (res.data) {
		res.data = formatDatesInResponse(res.data, ["updatedAt", "createdAt"]);
	}
	return res;
}

export async function putGuest(
	id: number,
	data: UpdateGuestPayload,
): Promise<ApiResponse<GuestData | undefined>> {
	const res = await apiCall<GuestData>({
		method: "put",
		endpoint: `${apiPrefix}/${id}`,
		body: data,
		fallbackValue: undefined,
		showAlert: true,
	});

	if (res.data) {
		res.data = formatDatesInResponse(res.data, ["updatedAt", "createdAt"]);
	}
	return res;
}

export async function deleteGuest(id: number): Promise<null> {
	await apiCall<null>({
		method: "delete",
		endpoint: `${apiPrefix}/${id}`,
		fallbackValue: null,
		showAlert: true,
	});
	return null;
}
