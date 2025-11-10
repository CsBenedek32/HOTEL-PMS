import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { getDevLogs } from "../api/devLogApi";
import type { DevLogData } from "../interfaces/devLog";
import { reloadTimestampAtom } from "./common";

const DevLogAtom = atom<Promise<DevLogData[]>>(async (get) => {
	get(reloadTimestampAtom);
	return await getDevLogs();
});

const LoadableDevLogAtom = loadable<Promise<DevLogData[]>>(DevLogAtom);

export { LoadableDevLogAtom };
