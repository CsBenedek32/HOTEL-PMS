import { atom } from "jotai";

export const confirmModalOpenAtom = atom<boolean>(false);
export const confirmModalQuestionAtom = atom<string>("");
export const confirmModalCallbackAtom = atom<(() => void) | undefined>(
	undefined,
);
export const confirmModalColorAtom = atom<
	"primary" | "secondary" | "error" | "warning" | "info" | "success"
>("primary");
export const confirmModalButtonTextAtom = atom<string>("common.confirm");
