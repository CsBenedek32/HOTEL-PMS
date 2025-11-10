import type { ApiResponse } from "../interfaces/api";
import type { GuestTagData, GuestTagFormData } from "../interfaces/guestTag";
import { formatDatesInResponse } from "../utils/dateUtils";
import { apiCall } from "./api";

const apiPrefix: string = "api/guest-tags";

export const getGuestTags = async (): Promise<GuestTagData[]> => {
	const res = await apiCall<GuestTagData[]>({
		method: "get",
		endpoint: apiPrefix,
		fallbackValue: [],
		showAlert: false,
	});

	return formatDatesInResponse(res.data, [
		"updatedAt",
		"createdAt",
	]) as GuestTagData[];
};

export async function postGuestTag(
	data: GuestTagFormData,
): Promise<ApiResponse<GuestTagData | undefined>> {
	const res = await apiCall<GuestTagData>({
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

export async function putGuestTag(
	id: number,
	data: GuestTagFormData,
): Promise<ApiResponse<GuestTagData | undefined>> {
	const res = await apiCall<GuestTagData>({
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

export async function deleteGuestTag(id: number): Promise<null> {
	await apiCall<null>({
		method: "delete",
		endpoint: `${apiPrefix}/${id}`,
		fallbackValue: null,
		showAlert: true,
	});
	return null;
}
