import i18n from "i18next";

export type SupportedLanguage = "eng" | "hu";

export const SUPPORTED_LANGUAGES: { code: SupportedLanguage; name: string }[] =
	[
		{ code: "eng", name: "English" },
		{ code: "hu", name: "Magyar" },
	];

export const changeLanguage = async (
	language: SupportedLanguage,
): Promise<void> => {
	try {
		await i18n.changeLanguage(language);
		localStorage.setItem("selectedLanguage", language);
	} catch (error) {
		console.error("Failed to change language:", error);
	}
};

export const getCurrentLanguage = (): SupportedLanguage => {
	const current = i18n.language;
	const isSupported = SUPPORTED_LANGUAGES.some((lang) => lang.code === current);
	return isSupported ? (current as SupportedLanguage) : "eng";
};

export const initializeLanguage = async (): Promise<void> => {
	const savedLanguage = localStorage.getItem(
		"selectedLanguage",
	) as SupportedLanguage | null;
	if (
		savedLanguage &&
		SUPPORTED_LANGUAGES.some((lang) => lang.code === savedLanguage)
	) {
		await changeLanguage(savedLanguage);
	}
};
