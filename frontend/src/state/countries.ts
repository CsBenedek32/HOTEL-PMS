import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { type CountryOption, getCountries } from "../api/countriesApi";

const CountriesAtom = atom<Promise<CountryOption[]>>(async () => {
	return await getCountries();
});

const LoadableCountriesAtom = loadable<Promise<CountryOption[]>>(CountriesAtom);

export { LoadableCountriesAtom };
