import { atomWithStorage } from "jotai/utils";
import type { User } from "../interfaces/user";

export const userAtom = atomWithStorage<User | null>("user", null);
