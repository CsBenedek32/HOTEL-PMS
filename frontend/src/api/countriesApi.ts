import axios from "axios";

interface CountryResponse {
	name: {
		common: string;
		official: string;
		nativeName?: Record<string, { official: string; common: string }>;
	};
}

export interface CountryOption {
	label: string;
	value: string;
}

export const getCountries = async (): Promise<CountryOption[]> => {
	try {
		const response = await axios.get<CountryResponse[]>(
			"https://restcountries.com/v3.1/all?fields=name",
		);

		const countries = response.data
			.map((country) => ({
				label: country.name.common,
				value: country.name.common,
			}))
			.sort((a, b) => a.label.localeCompare(b.label));

		return countries;
	} catch (error) {
		console.log("Failed to fetch countries:", error);
		return [];
	}
};
