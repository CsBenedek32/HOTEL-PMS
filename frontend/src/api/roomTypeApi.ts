import type { ApiResponse } from "../interfaces/api";
import type {
	CreateRoomTypePayload,
	RoomTypeData,
	UpdateRoomTypePayload,
} from "../interfaces/roomType";
import { formatDatesInResponse } from "../utils/dateUtils";
import { apiCall } from "./api";

const apiPrefix: string = "api/room-types";

export const getRoomTypes = async (): Promise<RoomTypeData[]> => {
	const res = await apiCall<RoomTypeData[]>({
		method: "get",
		endpoint: apiPrefix,
		fallbackValue: [],
		showAlert: false,
	});

	return formatDatesInResponse(res.data, [
		"updatedAt",
		"createdAt",
	]) as RoomTypeData[];
};

export async function postRoomType(
	data: CreateRoomTypePayload,
): Promise<ApiResponse<RoomTypeData | undefined>> {
	const res = await apiCall<RoomTypeData>({
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

export async function putRoomType(
	id: number,
	data: UpdateRoomTypePayload,
): Promise<ApiResponse<RoomTypeData | undefined>> {
	const res = await apiCall<RoomTypeData>({
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

export async function deleteRoomType(id: number): Promise<null> {
	await apiCall<null>({
		method: "delete",
		endpoint: `${apiPrefix}/${id}`,
		fallbackValue: null,
		showAlert: true,
	});
	return null;
}
