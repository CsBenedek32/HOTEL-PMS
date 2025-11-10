import type { ApiResponse } from "../interfaces/api";
import type { BuildingData, BuildingFormData } from "../interfaces/building";
import { formatDatesInResponse } from "../utils/dateUtils";
import { apiCall } from "./api";

const apiPrefix: string = "api/buildings";

export const getBuildings = async (): Promise<BuildingData[]> => {
	const res = await apiCall<BuildingData[]>({
		method: "get",
		endpoint: apiPrefix,
		fallbackValue: [],
		showAlert: false,
	});

	return formatDatesInResponse(res.data, [
		"updatedAt",
		"createdAt",
	]) as BuildingData[];
};

export async function postBuilding(
	data: BuildingFormData,
): Promise<ApiResponse<BuildingData | undefined>> {
	const res = await apiCall<BuildingData>({
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

export async function putBuilding(
	id: number,
	data: BuildingFormData,
): Promise<ApiResponse<BuildingData | undefined>> {
	const res = await apiCall<BuildingData>({
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

export async function deleteBuilding(id: number): Promise<null> {
	await apiCall<null>({
		method: "delete",
		endpoint: `${apiPrefix}/${id}`,
		fallbackValue: null,
		showAlert: true,
	});
	return null;
}
