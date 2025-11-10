import { atom } from "jotai";
import type { NavigationItem } from "../interfaces/nav";

export const navigationTitleAtom = atom<string>("");
export const navigationDrawerOpenAtom = atom<boolean>(false);
export const selectedIndexAtom = atom(1);
export const dataBankSubMenuAtom = atom(false);

export const navigationItemMenu: NavigationItem[] = [
	{
		path: "/dashboard",
		label: "navigationMenu.dashboard",
		permissions: [],
		icon: "Dashboard",
	},
	{
		path: "",
		label: "navigationMenu.reception",
		permissions: ["Admin", "Receptionist"],
		icon: "home",
		children: [
			{
				path: "/booking",
				label: "navigationMenu.reservation",
				permissions: ["Admin", "Receptionist"],
				icon: "luggage",
			},
			{
				path: "/roommirror",
				label: "navigationMenu.roommirror",
				permissions: ["Admin", "Receptionist"],
				icon: "calendarMonth",
			},
			{
				path: "/guest",
				label: "navigationMenu.guest",
				permissions: ["Admin", "Receptionist"],
				icon: "guest",
			},
		],
	},
	{
		path: "",
		label: "navigationMenu.invoiceData",
		permissions: ["Admin", "Invoice Manager"],
		icon: "reciept",
		children: [
			{
				path: "/service",
				label: "navigationMenu.services",
				permissions: ["Admin", "Invoice Manager"],
				icon: "buildCircle",
			},
			{
				path: "/vat",
				label: "navigationMenu.vat",
				permissions: ["Admin", "Invoice Manager"],
				icon: "percent",
			},
			{
				path: "/invoice",
				label: "navigationMenu.invoice",
				permissions: ["Admin", "Invoice Manager"],
				icon: "description",
			},
		],
	},
	{
		path: "",
		label: "navigationMenu.housekeeping",
		permissions: ["Admin", "Housekeeping"],
		icon: "cleaningServices",
		children: [
			{
				path: "/housekeepingDuties",
				label: "navigationMenu.housekeepingDuties",
				permissions: ["Admin", "Housekeeping"],
				icon: "Work",
			},
		],
	},
	{
		path: "",
		label: "navigationMenu.dataBank",
		icon: "folder",
		children: [
			{
				path: "/building",
				label: "navigationMenu.buildings",
				permissions: [],
				icon: "building",
			},
			{
				path: "/roomtype",
				label: "navigationMenu.roomType",
				permissions: [],
				icon: "roomtype",
			},
			{
				path: "/guestTag",
				label: "navigationMenu.guestTags",
				permissions: [],
				icon: "tag",
			},
			{
				path: "/amenity",
				label: "navigationMenu.amenities",
				permissions: [],
				icon: "amenity",
			},
			{
				path: "/bedtype",
				label: "navigationMenu.bedType",
				permissions: [],
				icon: "bed",
			},
			{
				path: "/room",
				label: "navigationMenu.rooms",
				permissions: [],
				icon: "room",
			},
			{
				path: "/user",
				label: "navigationMenu.user",
				permissions: [],
				icon: "user",
			},
			{
				path: "/role",
				label: "navigationMenu.roles",
				permissions: [],
				icon: "WorkspacePremium",
			},
			{
				path: "/changelog",
				label: "navigationMenu.changelog",
				permissions: [],
				icon: "changelog",
			},
			{
				path: "/companyInfo",
				label: "navigationMenu.companyInfo",
				permissions: [],
				icon: "business",
			},
		],
	},
];
