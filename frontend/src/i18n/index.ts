import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import engJson from "./lang/eng.json";
import huJson from "./lang/hu.json";

function init() {
	i18n.use(initReactI18next).init({
		resources: {
			eng: {
				translation: engJson,
			},
			hu: {
				translation: huJson,
			},
		},
		lng: "eng",
		fallbackLng: "eng",

		interpolation: {
			escapeValue: false,
		},
	});
}

export default init;
