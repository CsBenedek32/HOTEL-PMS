import type { ApiResponse } from "../interfaces/api";
import type {
	CompanyInfoData,
	CompanyInfoFormData,
} from "../interfaces/companyInfo";
import { apiCall } from "./api";

const apiPrefix: string = "api/company-info";

export const getCompanyInfo = async (): Promise<
	CompanyInfoData | undefined
> => {
	const res = await apiCall<CompanyInfoData>({
		method: "get",
		endpoint: apiPrefix,
		fallbackValue: undefined,
		showAlert: false,
	});

	return res.data;
};

export async function postCompanyInfo(
	data: CompanyInfoFormData,
): Promise<ApiResponse<CompanyInfoData | undefined>> {
	const res = await apiCall<CompanyInfoData>({
		method: "post",
		endpoint: apiPrefix,
		body: data,
		fallbackValue: undefined,
		showAlert: true,
	});

	return res;
}
