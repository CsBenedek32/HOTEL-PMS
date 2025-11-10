import type { ApiResponse } from "../interfaces/api";
import type { BedTypeData, BedTypeFormData } from "../interfaces/bedType";
import { formatDatesInResponse } from "../utils/dateUtils";
import { apiCall } from "./api";

const apiPrefix: string = "api/bed-types";

export const getBedTypes = async (): Promise<BedTypeData[]> => {
	const res = await apiCall<BedTypeData[]>({
		method: "get",
		endpoint: apiPrefix,
		fallbackValue: [],
		showAlert: false,
	});

	return formatDatesInResponse(res.data, [
		"updatedAt",
		"createdAt",
	]) as BedTypeData[];
};

export async function postBedType(
	data: BedTypeFormData,
): Promise<ApiResponse<BedTypeData | undefined>> {
	const res = await apiCall<BedTypeData>({
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

export async function putBedType(
	id: number,
	data: BedTypeFormData,
): Promise<ApiResponse<BedTypeData | undefined>> {
	const res = await apiCall<BedTypeData>({
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

export async function deleteBedType(id: number): Promise<null> {
	await apiCall<null>({
		method: "delete",
		endpoint: `${apiPrefix}/${id}`,
		fallbackValue: null,
		showAlert: true,
	});
	return null;
}
