import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { getCurrentUser, getUsers } from "../api/userApi";
import type { UserData } from "../interfaces/user";
import { reloadTimestampAtom } from "./common";

const UserAtom = atom<Promise<UserData[]>>(async (get) => {
	get(reloadTimestampAtom);
	return await getUsers();
});

export const selectedUserAtom = atom<UserData | null>(null);
export const userInfoDrawerAtom = atom<boolean>(false);

export const LoadableUserAtom = loadable<Promise<UserData[]>>(UserAtom);

const CurrentUserAtom = atom<Promise<UserData | undefined>>(async () => {
	return await getCurrentUser();
});

export const LoadableCurrentUserAtom =
	loadable<Promise<UserData | undefined>>(CurrentUserAtom);
