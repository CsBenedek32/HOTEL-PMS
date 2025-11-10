import type { iconMap } from "../router/navItemIcons";

export interface NavigationItem {
	path: string;
	label: string;
	permissions?: string[];
	icon: keyof typeof iconMap;
	children?: NavigationItem[];
	disabled?: boolean;
}

export interface NavigationProps {
	path: string;
	label: string;
	key?: string | number;
	permissions?: string[];
	icon?: keyof typeof iconMap;
	disabled?: boolean;
}
