import type { ApiResponse } from "../interfaces/api";
import type { HousekeepingStatus } from "../interfaces/enums";
import type {
	CreateHousekeepingPayload,
	HousekeepingData,
	UpdateHousekeepingPayload,
} from "../interfaces/housekeeping";
import { apiCall } from "./api";

const apiPrefix: string = "api/housekeeping";

export const getHousekeeping = async (): Promise<HousekeepingData[]> => {
	const res = await apiCall<HousekeepingData[]>({
		method: "get",
		endpoint: apiPrefix,
		fallbackValue: [],
		showAlert: false,
	});

	return res.data as HousekeepingData[];
};

export async function postHousekeeping(
	data: CreateHousekeepingPayload,
): Promise<ApiResponse<HousekeepingData | undefined>> {
	const res = await apiCall<HousekeepingData>({
		method: "post",
		endpoint: apiPrefix,
		body: data,
		fallbackValue: undefined,
		showAlert: true,
	});
	return res;
}

export async function putHousekeeping(
	id: number,
	data: UpdateHousekeepingPayload,
): Promise<ApiResponse<HousekeepingData | undefined>> {
	const res = await apiCall<HousekeepingData>({
		method: "put",
		endpoint: `${apiPrefix}/${id}`,
		body: data,
		fallbackValue: undefined,
		showAlert: true,
	});
	return res;
}

export async function setHousekeepingStatus(
	id: number,
	status: HousekeepingStatus,
): Promise<ApiResponse<HousekeepingData | undefined>> {
	const res = await apiCall<HousekeepingData>({
		method: "put",
		endpoint: `${apiPrefix}/${id}/status?status=${status}`,
		fallbackValue: undefined,
		showAlert: true,
	});
	return res;
}

export async function deleteHousekeeping(id: number): Promise<null> {
	await apiCall<null>({
		method: "delete",
		endpoint: `${apiPrefix}/${id}`,
		fallbackValue: null,
		showAlert: true,
	});
	return null;
}
