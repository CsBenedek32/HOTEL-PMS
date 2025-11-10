import type { ApiResponse } from "../interfaces/api";
import type { VatData, VatFormData } from "../interfaces/vat";
import { apiCall } from "./api";

const apiPrefix: string = "api/vats";

export const getVats = async (): Promise<VatData[]> => {
	const res = await apiCall<VatData[]>({
		method: "get",
		endpoint: apiPrefix,
		fallbackValue: [],
		showAlert: false,
	});

	return res.data as VatData[];
};

export async function postVat(
	data: VatFormData,
): Promise<ApiResponse<VatData | undefined>> {
	const res = await apiCall<VatData>({
		method: "post",
		endpoint: apiPrefix,
		body: data,
		fallbackValue: undefined,
		showAlert: true,
	});
	return res;
}

export async function putVat(
	id: number,
	data: VatFormData,
): Promise<ApiResponse<VatData | undefined>> {
	const res = await apiCall<VatData>({
		method: "put",
		endpoint: `${apiPrefix}/${id}`,
		body: data,
		fallbackValue: undefined,
		showAlert: true,
	});
	return res;
}

export async function deleteVat(id: number): Promise<null> {
	await apiCall<null>({
		method: "delete",
		endpoint: `${apiPrefix}/${id}`,
		fallbackValue: null,
		showAlert: true,
	});
	return null;
}
