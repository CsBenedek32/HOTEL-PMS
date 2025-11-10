import type { ApiResponse } from "../interfaces/api";
import type { UpdateUserPayload, UserData } from "../interfaces/user";
import { formatDatesInResponse } from "../utils/dateUtils";
import { apiCall } from "./api";

const apiPrefix: string = "api/users";

export const getUsers = async (): Promise<UserData[]> => {
	const res = await apiCall<UserData[]>({
		method: "get",
		endpoint: apiPrefix,
		fallbackValue: [],
		showAlert: false,
	});

	return formatDatesInResponse(res.data, [
		"updatedAt",
		"createdAt",
	]) as UserData[];
};

export async function postUser(
	data: UpdateUserPayload,
): Promise<ApiResponse<UserData | undefined>> {
	const res = await apiCall<UserData>({
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

export async function putUser(
	id: number,
	data: UpdateUserPayload,
): Promise<ApiResponse<UserData | undefined>> {
	const res = await apiCall<UserData>({
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

export async function deleteUser(id: number): Promise<null> {
	await apiCall<null>({
		method: "delete",
		endpoint: `${apiPrefix}/${id}`,
		fallbackValue: null,
		showAlert: true,
	});
	return null;
}

export async function activateUser(id: number): Promise<null> {
	await apiCall<null>({
		method: "post",
		endpoint: `${apiPrefix}/${id}/activate`,
		fallbackValue: null,
		showAlert: true,
	});
	return null;
}

export async function deactivateUser(id: number): Promise<null> {
	await apiCall<null>({
		method: "post",
		endpoint: `${apiPrefix}/${id}/deactivate`,
		fallbackValue: null,
		showAlert: true,
	});
	return null;
}

export const getCurrentUser = async (): Promise<UserData | undefined> => {
	const res = await apiCall<UserData>({
		method: "get",
		endpoint: `${apiPrefix}/me`,
		fallbackValue: undefined,
		showAlert: false,
	});

	if (res.data) {
		return formatDatesInResponse(res.data, [
			"updatedAt",
			"createdAt",
		]) as UserData;
	}
	return undefined;
};
