import type { FormValues } from "../lib/form";

export interface CompanyInfoData {
	id: number;
	companyName: string;
	address: string;
	phone: string;
	email: string;
	website?: string;
	logoUrl?: string;
	taxNumber?: string;
	registrationNumber?: string;
}

export interface CompanyInfoFormData extends FormValues {
	companyName: string;
	address: string;
	phone: string;
	email: string;
	website: string;
	logoUrl: string;
	taxNumber: string;
	registrationNumber: string;
}
