import {
	AccountCircle,
	ExpandLess,
	ExpandMore,
	Language,
	Logout,
	Mail,
} from "@mui/icons-material";
import {
	Collapse,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import { useAtom } from "jotai";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { logout } from "../api/api";
import type { NavigationItem } from "../interfaces/nav";
import { iconMap } from "../router/navItemIcons";
import { RedirectButton } from "../router/redirectBtn";
import { navigationDrawerOpenAtom, navigationItemMenu } from "../state/nav";
import { userAtom } from "../state/userState";
import {
	changeLanguage,
	getCurrentLanguage,
	SUPPORTED_LANGUAGES,
} from "../utils/languageUtils";
import { hasPermission } from "../utils/permissions";

const NavigationDrawer = () => {
	const { t } = useTranslation();
	const [open, setOpen] = useAtom(navigationDrawerOpenAtom);
	const [hovered, setHovered] = useState(false);
	const [langHovered, setLangHovered] = useState(false);
	const [user] = useAtom(userAtom);
	const navigate = useNavigate();
	const currentLocation = window.location;
	const currentLang = getCurrentLanguage();

	const isChildActive = (item: NavigationItem): boolean => {
		if (item.children) {
			return item.children.some(
				(child) => child.path === currentLocation.pathname,
			);
		}
		return false;
	};

	const renderALevel = (
		items: NavigationItem[],
		level = 0,
	): ReactNode | undefined => {
		const elements: ReactNode[] = [];

		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			const key = `${item.path}${level}${i}`;
			// biome-ignore lint/correctness/useHookAtTopLevel: dont care
			const [eA, setEA] = useState(false);

			if (item.children !== undefined && item.children?.length > 0) {
				const renderedChilds = renderALevel(item.children, level + 1);
				const isActive = isChildActive(item);
				if (renderedChilds) {
					elements.push(
						<span key={key}>
							<ListItemButton
								onMouseEnter={() => setEA(true)}
								onMouseLeave={() => setEA(false)}
								sx={{
									px: 3.5,
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										justifyContent: "center",
										display: "flex",
										alignItems: "center",
										width: open ? "240" : "40",
										color: isActive ? "primary.main" : "white",
									}}
								>
									{item.icon ? iconMap[item.icon] : <Mail />}
								</ListItemIcon>
								<ListItemText
									sx={{
										transition: "opacity 0.3s",
										opacity: open ? 1 : 0,
										pl: 2,
									}}
									primary={t(item.label)}
								/>

								{open && (eA ? <ExpandLess /> : <ExpandMore />)}
							</ListItemButton>
							<Collapse
								onMouseEnter={() => setEA(true)}
								onMouseLeave={() => setEA(false)}
								sx={{ ml: 2 }}
								in={eA}
								timeout={500}
								unmountOnExit
							>
								{renderedChilds}
							</Collapse>
						</span>,
					);
				}
			} else {


				elements.push(
					<span key={key}>
						<RedirectButton
							path={item.path}
							label={item.label}
							icon={item.icon}
							disabled={hasPermission(item.permissions || []) === false}

						/>
					</span>,
				);

			}
		}

		if (elements.length > 0) {
			return <List>{elements}</List>;
		}

		return undefined;
	};

	const navigationList =
		user !== null ? renderALevel(navigationItemMenu) : undefined;

	return (
		<Drawer
			variant="permanent"
			sx={{
				width: open ? 260 : 80,
				flexShrink: 0,
				whiteSpace: "nowrap",
				position: "absolute",
				height: "100vh",
				transition: "width 0.3s ease-in-out",
				"& .MuiDrawer-paper": {
					width: open ? 260 : 80,
					transition: "width 0.3s ease-in-out",
					overflow: "hidden",
					position: "absolute",
					backgroundColor: "#343A40",
					flexDirection: "column",
					justifyContent: "space-between",
					color: "white",
				},
				padding: 0,
				margin: "auto",
			}}
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
		>
			<List sx={{ justifyContent: "center" }}>{navigationList}</List>

			<div>
				<ListItem
					disablePadding
					sx={{ display: "flex", justifyContent: "center", mb: 1 }}
					onMouseEnter={() => setLangHovered(true)}
					onMouseLeave={() => setLangHovered(false)}
				>
					<ListItemButton
						sx={{
							minHeight: 48,
							px: 3.2,
							justifyContent: open ? "initial" : "center",
						}}
						onClick={async () => {
							const nextLang = currentLang === "eng" ? "hu" : "eng";
							await changeLanguage(nextLang);
						}}
					>
						<ListItemIcon
							sx={{
								minWidth: 0,
								justifyContent: "center",
								display: "flex",
								alignItems: "center",
								width: open ? "240" : "40",
								color: langHovered ? "primary.main" : "white",
							}}
						>
							<Language />
						</ListItemIcon>

						<ListItemText
							sx={{
								transition: "opacity 0.3s",
								opacity: open ? 1 : 0,
								textAlign: "center",
								color: "white",
							}}
							primary={
								langHovered
									? currentLang === "eng"
										? t("common.switchToHungarian")
										: t("common.switchToEnglish")
									: SUPPORTED_LANGUAGES.find(
										(lang) => lang.code === currentLang,
									)?.name || currentLang.toUpperCase()
							}
						/>
					</ListItemButton>
				</ListItem>

				<ListItem
					disablePadding
					sx={{ display: "flex", justifyContent: "center", mb: 2 }}
					onMouseEnter={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
				>
					<ListItemButton
						sx={{
							minHeight: 48,
							px: 3.2,
							justifyContent: open ? "initial" : "center",
						}}
						onClick={async () => {
							await logout();
							navigate("/");
						}}
					>
						<ListItemIcon
							sx={{
								minWidth: 0,
								justifyContent: "center",
								display: "flex",
								alignItems: "center",
								width: open ? "240" : "40",
								color: hovered ? "primary.main" : "white",
							}}
						>
							{hovered ? <Logout /> : <AccountCircle />}
						</ListItemIcon>

						<ListItemText
							sx={{
								transition: "opacity 0.3s",
								opacity: open ? 1 : 0,
								textAlign: "center",
								color: "white",
							}}
							primary={
								hovered
									? t("common.logout")
									: user !== null
										? `${user.email}`
										: t("common.guest")
							}
						/>
					</ListItemButton>
				</ListItem>
			</div>
		</Drawer>
	);
};

export default NavigationDrawer;
