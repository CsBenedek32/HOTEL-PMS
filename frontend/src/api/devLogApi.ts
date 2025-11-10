import type { DevLogData } from "../interfaces/devLog";
import { formatDatesInResponse } from "../utils/dateUtils";
import { apiCall } from "./api";

const apiPrefix: string = "api/dev-logs";

export const getDevLogs = async (): Promise<DevLogData[]> => {
	const res = await apiCall<DevLogData[]>({
		method: "get",
		endpoint: apiPrefix,
		fallbackValue: [],
		showAlert: false,
	});

	return formatDatesInResponse(res.data, [
		"updatedAt",
		"createdAt",
	]) as DevLogData[];
};
