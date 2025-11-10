import type { ApiResponse } from "../interfaces/api";
import type { ServiceData, ServiceFormData } from "../interfaces/service";
import { formatDatesInResponse } from "../utils/dateUtils";
import { apiCall } from "./api";

const apiPrefix: string = "api/service-models";

export const getServices = async (): Promise<ServiceData[]> => {
	const res = await apiCall<ServiceData[]>({
		method: "get",
		endpoint: apiPrefix,
		fallbackValue: [],
		showAlert: false,
	});

	return formatDatesInResponse(res.data, [
		"updatedAt",
		"createdAt",
	]) as ServiceData[];
};

export async function postService(
	data: ServiceFormData,
): Promise<ApiResponse<ServiceData | undefined>> {
	const res = await apiCall<ServiceData>({
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

export async function putService(
	id: number,
	data: ServiceFormData,
): Promise<ApiResponse<ServiceData | undefined>> {
	const res = await apiCall<ServiceData>({
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

export async function deleteService(id: number): Promise<null> {
	await apiCall<null>({
		method: "delete",
		endpoint: `${apiPrefix}/${id}`,
		fallbackValue: null,
		showAlert: true,
	});
	return null;
}
