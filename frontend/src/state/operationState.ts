import { atom } from "jotai";

export const successMessageTranslationKeyAtom = atom<string>();
export const successCodeTranslationKeyAtom = atom<string>();
export const errorMessageTranslationKeyAtom = atom<string>();
export const errorCodeTranslationKeyAtom = atom<string>();
export const successSeverityAtom = atom<"success" | "info">("success");
export const errorSeverityAtom = atom<"warning" | "error">("error");
