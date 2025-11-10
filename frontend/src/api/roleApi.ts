import type { ApiResponse } from "../interfaces/api";
import type { RoleData, RoleFormData } from "../interfaces/role";
import { formatDatesInResponse } from "../utils/dateUtils";
import { apiCall } from "./api";

const apiPrefix: string = "api/roles";

export const getRoles = async (): Promise<RoleData[]> => {
	const res = await apiCall<RoleData[]>({
		method: "get",
		endpoint: apiPrefix,
		fallbackValue: [],
		showAlert: false,
	});

	return formatDatesInResponse(res.data, [
		"updatedAt",
		"createdAt",
	]) as RoleData[];
};

export async function postRole(
	data: RoleFormData,
): Promise<ApiResponse<RoleData | undefined>> {
	const res = await apiCall<RoleData>({
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

export async function putRole(
	id: number,
	data: RoleFormData,
): Promise<ApiResponse<RoleData | undefined>> {
	const res = await apiCall<RoleData>({
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

export async function deleteRole(id: number): Promise<null> {
	await apiCall<null>({
		method: "delete",
		endpoint: `${apiPrefix}/${id}`,
		fallbackValue: null,
		showAlert: true,
	});
	return null;
}
