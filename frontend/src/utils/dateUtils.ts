import { formatDate } from "date-fns";

//const USER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const DATETIME_FORMAT = "yyyy.MM.dd HH:mm";
export const DATE_FORMAT = "yyyy.MM.dd";

export function arrayToDate(dateArray: number[]): Date {
	if (!Array.isArray(dateArray) || dateArray.length < 3) {
		throw new Error("Invalid date array format");
	}

	const [year, month, day, hour = 0, minute = 0, second = 0, nanoseconds = 0] =
		dateArray;

	return new Date(
		year,
		month - 1,
		day,
		hour,
		minute,
		second,
		nanoseconds / 1000000,
	);
}

export function dateToArray(date: Date): number[] {
	return [
		date.getFullYear(),
		date.getMonth() + 1,
		date.getDate(),
		date.getHours(),
		date.getMinutes(),
		date.getSeconds(),
		date.getMilliseconds() * 1000000,
	];
}

export function dateToString(date: Date, format = DATETIME_FORMAT): string {
	return formatDate(date, format);
}

export function formatDatesInResponse<T>(obj: T, dateFields: string[]): T {
	if (!obj || typeof obj !== "object") {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => formatDatesInResponse(item, dateFields)) as T;
	}

	// biome-ignore lint/suspicious/noExplicitAny: dont care
	const result = { ...obj } as any;

	for (const key in result) {
		if (dateFields.includes(key) && Array.isArray(result[key])) {
			result[key] = arrayToDate(result[key]);
		} else if (typeof result[key] === "object" && result[key] !== null) {
			result[key] = formatDatesInResponse(result[key], dateFields);
		}
	}

	return result as T;
}

export const normalizeDate = (date: Date): Date => {
	if (!date || !(date instanceof Date)) return new Date();
	const normalized = new Date(date);
	normalized.setHours(0, 0, 0, 0);
	return normalized;
};
