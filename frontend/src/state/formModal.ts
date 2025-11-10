import { atom } from "jotai";
import type { ButtonConfig, FormConfig, FormValues } from "../lib/form";

export const formModalOpenAtom = atom<boolean>(false);
export const formModalTitleAtom = atom<string>("");
export const formModalConfigAtom = atom<FormConfig | null>(null);
export const formModalInitialValuesAtom = atom<Partial<FormValues>>({});
export const formModalOnSubmitAtom = atom<
	((values: FormValues) => void | Promise<void>) | null
>(null);
export const formModalButtonsAtom = atom<ButtonConfig>({
	save: true,
	cancel: true,
});
