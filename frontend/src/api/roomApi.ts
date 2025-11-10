import type { ApiResponse } from "../interfaces/api";
import type {
	CreateRoomPayload,
	RoomData,
	UpdateRoomPayload,
} from "../interfaces/room";
import type {
	RoomMirrorData,
	RoomMirrorParams,
} from "../interfaces/roomMirror";
import { formatDatesInResponse } from "../utils/dateUtils";
import { apiCall } from "./api";

const apiPrefix: string = "api/rooms";

export const getRooms = async (): Promise<RoomData[]> => {
	const res = await apiCall<RoomData[]>({
		method: "get",
		endpoint: apiPrefix,
		fallbackValue: [],
		showAlert: false,
	});

	return formatDatesInResponse(res.data, [
		"updatedAt",
		"createdAt",
	]) as RoomData[];
};

export async function postRoom(
	data: CreateRoomPayload,
): Promise<ApiResponse<RoomData | undefined>> {
	const res = await apiCall<RoomData>({
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

export async function putRoom(
	id: number,
	data: UpdateRoomPayload,
): Promise<ApiResponse<RoomData | undefined>> {
	const res = await apiCall<RoomData>({
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

export async function deleteRoom(id: number): Promise<null> {
	await apiCall<null>({
		method: "delete",
		endpoint: `${apiPrefix}/${id}`,
		fallbackValue: null,
		showAlert: true,
	});
	return null;
}

export const getRoomMirror = async (
	params: RoomMirrorParams,
): Promise<RoomMirrorData[]> => {
	const queryParams = new URLSearchParams({
		buildingId: params.buildingId.toString(),
		startDate: params.startDate,
		endDate: params.endDate,
	});

	const res = await apiCall<RoomMirrorData[]>({
		method: "get",
		endpoint: `${apiPrefix}/mirror?${queryParams.toString()}`,
		fallbackValue: [],
		showAlert: false,
	});

	return formatDatesInResponse(res.data, [
		"updatedAt",
		"createdAt",
		"checkInDate",
		"checkOutDate",
	]) as RoomMirrorData[];
};

export const getAvailableRooms = async (
	checkInDate: Date,
	checkOutDate: Date,
	excludeBookingId?: number,
): Promise<RoomData[]> => {
	const checkInDateArray = [
		checkInDate.getFullYear(),
		checkInDate.getMonth() + 1,
		checkInDate.getDate(),
	];
	const checkOutDateArray = [
		checkOutDate.getFullYear(),
		checkOutDate.getMonth() + 1,
		checkOutDate.getDate(),
	];

	const res = await apiCall<RoomData[]>({
		method: "post",
		endpoint: `${apiPrefix}/availability`,
		body: {
			checkInDate: checkInDateArray,
			checkOutDate: checkOutDateArray,
			excludeBookingId,
			filters: {},
		},
		fallbackValue: [],
		showAlert: false,
	});

	return formatDatesInResponse(res.data, [
		"updatedAt",
		"createdAt",
	]) as RoomData[];
};
