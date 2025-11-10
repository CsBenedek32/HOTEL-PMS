import { Lock } from "@mui/icons-material";
import {
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { startTransition } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import type { NavigationProps } from "../interfaces/nav";
import { reloadTimestampAtom } from "../state/common";
import { navigationDrawerOpenAtom } from "../state/nav";
import { useResetFilters } from "../utils/resetFiltersHook";
import { iconMap } from "./navItemIcons";

export const RedirectButton = ({
	path,
	label,
	icon,
	disabled,
}: NavigationProps) => {
	const { t } = useTranslation();
	const isNavOpen = useAtomValue(navigationDrawerOpenAtom);
	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);
	const resetFilters = useResetFilters();
	const navigate = useNavigate();
	const currentLocation = window.location;

	const clickFn = () => {
		navigate(path);
		startTransition(() => {
			resetFilters();
			setReloadTimestamp(Date.now());
		});
	};

	// biome-ignore lint/suspicious/noExplicitAny: dont care
	const onMouseDown = (event: any) => {
		if (event.button === 1) {
			const url = new URL(window.location.href);
			url.pathname = path;
			window.open(url, "_blank");
		}
	};

	const text = label ? t(label) : path;

	const iconImg = disabled ? <Lock /> : iconMap[icon ? icon : "Mail"];

	const current =
		currentLocation.pathname === path ||
		(currentLocation.pathname === "/" && path === "/dashboard");

	return (
		<ListItem
			disablePadding
			sx={{
				display: "flex",

				paddingY: 0,
				marginY: 0,
			}}
		>
			<ListItemButton
				selected={current}
				sx={{
					px: 3.5,
				}}
				onClick={() => {
					clickFn();
				}}
				onMouseDown={onMouseDown}
				disabled={disabled ? disabled : false}
			>
				<ListItemIcon
					sx={{
						minWidth: 0,
						display: "flex",
						width: isNavOpen ? "240" : "40",
						color: current ? "primary.main" : "white",
					}}
				>
					{iconImg}
				</ListItemIcon>
				<ListItemText
					sx={{
						transition: "opacity 0.3s",
						opacity: isNavOpen ? 1 : 0,
						pl: 2,
					}}
					primary={text}
				/>
			</ListItemButton>
		</ListItem>
	);
};
