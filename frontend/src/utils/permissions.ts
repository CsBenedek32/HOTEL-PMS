import { store } from "../state/store";
import { userAtom } from "../state/userState";

export function hasPermission(_requiredRoles: string[]): boolean {
	const user = store.get(userAtom);

	if (!user || !user.roles) {
		return false;
	}

	if (_requiredRoles.length === 0) {
		return true;
	}

	const userRoles = user.roles.map((role) => role.split("_")[1]);

	return userRoles.some((role) => _requiredRoles.includes(role));
}
