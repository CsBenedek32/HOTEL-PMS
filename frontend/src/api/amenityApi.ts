import type { AmenityData, AmenityFormData } from "../interfaces/amenity";
import type { ApiResponse } from "../interfaces/api";
import { formatDatesInResponse } from "../utils/dateUtils";
import { apiCall } from "./api";

const apiPrefix: string = "api/amenities";

export const getAmenities = async (): Promise<AmenityData[]> => {
	const res = await apiCall<AmenityData[]>({
		method: "get",
		endpoint: apiPrefix,
		fallbackValue: [],
		showAlert: false,
	});

	return formatDatesInResponse(res.data, [
		"updatedAt",
		"createdAt",
	]) as AmenityData[];
};

export async function postAmenity(
	data: AmenityFormData,
): Promise<ApiResponse<AmenityData | undefined>> {
	const res = await apiCall<AmenityData>({
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

export async function putAmenity(
	id: number,
	data: AmenityFormData,
): Promise<ApiResponse<AmenityData | undefined>> {
	const res = await apiCall<AmenityData>({
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

export async function deleteAmenity(id: number): Promise<null> {
	await apiCall<null>({
		method: "delete",
		endpoint: `${apiPrefix}/${id}`,
		fallbackValue: null,
		showAlert: true,
	});
	return null;
}
