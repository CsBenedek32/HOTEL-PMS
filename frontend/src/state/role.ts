import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { getRoles } from "../api/roleApi";
import type { RoleData } from "../interfaces/role";
import { reloadTimestampAtom } from "./common";

const RoleAtom = atom<Promise<RoleData[]>>(async (get) => {
	get(reloadTimestampAtom);
	return await getRoles();
});

export const selectedRoleAtom = atom<RoleData | null>(null);
export const roleInfoDrawerAtom = atom<boolean>(false);

export const LoadableRoleAtom = loadable<Promise<RoleData[]>>(RoleAtom);
