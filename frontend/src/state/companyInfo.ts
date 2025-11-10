import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { getCompanyInfo } from "../api/companyInfoApi";
import type { CompanyInfoData } from "../interfaces/companyInfo";
import type { FormState } from "../lib/form";
import { reloadTimestampAtom } from "./common";

const CompanyInfoAtom = atom<Promise<CompanyInfoData | undefined>>(
	async (get) => {
		get(reloadTimestampAtom);
		return await getCompanyInfo();
	},
);

const companyInfoDrawerAtom = atom<boolean>(false);
const LoadableCompanyInfoAtom =
	loadable<Promise<CompanyInfoData | undefined>>(CompanyInfoAtom);
const companyInfoFormAtom = atom<FormState>({
	values: {},
	errors: {},
	touched: {},
});

export { LoadableCompanyInfoAtom, companyInfoFormAtom, companyInfoDrawerAtom };
