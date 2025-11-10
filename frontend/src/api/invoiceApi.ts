import type { ApiResponse } from "../interfaces/api";
import type {
	CreateInvoicePayload,
	InvoiceData,
	UpdateInvoicePayload,
} from "../interfaces/invoice";
import { formatDatesInResponse } from "../utils/dateUtils";
import { api, apiCall } from "./api";

const INVOICE_DATE_FIELDS = ["updatedAt", "createdAt"] as const;
const apiPrefix: string = "api/invoices";

export const getInvoices = async (id?: number): Promise<InvoiceData[]> => {
	const res = await apiCall<InvoiceData[]>({
		method: "get",
		endpoint: `${apiPrefix}${id ? `?id=${id}` : ""}`,
		fallbackValue: [],
		showAlert: false,
	});

	return formatDatesInResponse(res.data, [
		...INVOICE_DATE_FIELDS,
	]) as InvoiceData[];
};

export async function postInvoice(
	data: CreateInvoicePayload,
): Promise<ApiResponse<InvoiceData | undefined>> {
	const res = await apiCall<InvoiceData>({
		method: "post",
		endpoint: apiPrefix,
		body: data,
		fallbackValue: undefined,
		showAlert: true,
	});

	if (res.data) {
		res.data = formatDatesInResponse(res.data, [...INVOICE_DATE_FIELDS]);
	}
	return res;
}

export async function putInvoice(
	id: number,
	data: UpdateInvoicePayload,
): Promise<ApiResponse<InvoiceData | undefined>> {
	const res = await apiCall<InvoiceData>({
		method: "put",
		endpoint: `${apiPrefix}/${id}`,
		body: data,
		fallbackValue: undefined,
		showAlert: true,
	});

	if (res.data) {
		res.data = formatDatesInResponse(res.data, [...INVOICE_DATE_FIELDS]);
	}
	return res;
}

export async function deleteInvoice(id: number): Promise<null> {
	await apiCall<null>({
		method: "delete",
		endpoint: `${apiPrefix}/${id}`,
		fallbackValue: null,
		showAlert: true,
	});
	return null;
}

export async function syncInvoiceWithBookings(id: number): Promise<null> {
	await apiCall<null>({
		method: "post",
		endpoint: `${apiPrefix}/${id}/sync`,
		fallbackValue: null,
		showAlert: true,
	});
	return null;
}

export async function addBookingToInvoice(
	id: number,
	bookingId: number,
): Promise<ApiResponse<InvoiceData | undefined>> {
	const res = await apiCall<InvoiceData>({
		method: "post",
		endpoint: `${apiPrefix}/${id}/bookings/${bookingId}`,
		body: {},
		fallbackValue: undefined,
		showAlert: true,
	});

	if (res.data) {
		res.data = formatDatesInResponse(res.data, [...INVOICE_DATE_FIELDS]);
	}
	return res;
}

export async function removeBookingFromInvoice(
	id: number,
	bookingId: number,
): Promise<ApiResponse<InvoiceData | undefined>> {
	const res = await apiCall<InvoiceData>({
		method: "delete",
		endpoint: `${apiPrefix}/${id}/bookings/${bookingId}`,
		body: {},
		fallbackValue: undefined,
		showAlert: true,
	});

	if (res.data) {
		res.data = formatDatesInResponse(res.data, [...INVOICE_DATE_FIELDS]);
	}
	return res;
}

export async function updateInvoiceServices(
	id: number,
	serviceIds: number[],
): Promise<ApiResponse<InvoiceData | undefined>> {
	const res = await apiCall<InvoiceData>({
		method: "post",
		endpoint: `${apiPrefix}/${id}/services`,
		body: serviceIds,
		fallbackValue: undefined,
		showAlert: true,
	});

	if (res.data) {
		res.data = formatDatesInResponse(res.data, [...INVOICE_DATE_FIELDS]);
	}
	return res;
}

export async function exportInvoiceToPdf(id: number): Promise<Blob | null> {
	try {
		if (!api) {
			return null;
		}

		const response = await api.get(`${apiPrefix}/${id}/export/pdf`, {
			responseType: "blob",
		});

		return response.data;
	} catch (err) {
		console.log("Failed to export invoice to PDF:", err);
		return null;
	}
}
