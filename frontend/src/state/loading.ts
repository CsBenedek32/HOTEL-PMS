import { atom } from "jotai";

export const loadingModalAtom = atom<boolean>(false);
export const loadingModalMessageAtom = atom<string>("Loading...");
