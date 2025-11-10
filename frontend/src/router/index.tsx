import { createBrowserRouter } from "react-router";
import AuthLayout from "../components/AuthLayout";
import Layout from "../components/Layout";
import AccountInactivePage from "../pages/AccountInactivePage";
import AmenityPage from "../pages/AmenityPage";
import BedTypePage from "../pages/BedTypePage";
import BookingPage from "../pages/BookingPage";
import BuildingPage from "../pages/BuildingPage";
import CompanyInfoPage from "../pages/CompanyInfoPage";
import DashboardPage from "../pages/DashboardPage";
import DevLogPage from "../pages/DevLogPage";
import ErrorPage from "../pages/ErrorPage";
import GuestPage from "../pages/GuestPage";
import GuestTagPage from "../pages/GuestTagPage";
import HousekeepingPage from "../pages/HousekeepingPage";
import InvoicePage from "../pages/InvoicePage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import RegisterPage from "../pages/RegisterPage";
import RolePage from "../pages/RolePage";
import RoomMirrorPage from "../pages/RoomMirrorPage";
import RoomPage from "../pages/RoomPage";
import RoomTypePage from "../pages/RoomTypePage";
import ServicePage from "../pages/ServicePage";
import UserPage from "../pages/UserPage";
import VatPage from "../pages/VatPage";

export const authRouter = createBrowserRouter([
	{
		path: "/",
		element: <AuthLayout />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <LoginPage />,
			},
			{
				path: "login",
				element: <LoginPage />,
			},
			{
				path: "register",
				element: <RegisterPage />,
			},
			{
				path: "account-inactive",
				element: <AccountInactivePage />,
			},
			{
				path: "*",
				element: <LoginPage />,
			},
		],
	},
]);

export const mainRouter = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <DashboardPage />,
			},
			{
				path: "dashboard",
				element: <DashboardPage />,
			},
			{
				path: "role",
				element: <RolePage />,
			},
			{
				path: "user",
				element: <UserPage />,
			},
			{
				path: "roomType",
				element: <RoomTypePage />,
			},
			{
				path: "building",
				element: <BuildingPage />,
			},
			{
				path: "changelog",
				element: <DevLogPage />,
			},
			{
				path: "vat",
				element: <VatPage />,
			},
			{
				path: "service",
				element: <ServicePage />,
			},
			{
				path: "housekeepingDuties",
				element: <HousekeepingPage />,
			},
			{
				path: "invoice",
				element: <InvoicePage />,
			},
			{
				path: "roommirror",
				element: <RoomMirrorPage />,
			},
			{
				path: "bedType",
				element: <BedTypePage />,
			},
			{
				path: "amenity",
				element: <AmenityPage />,
			},
			{
				path: "booking",
				element: <BookingPage />,
			},
			{
				path: "room",
				element: <RoomPage />,
			},
			{
				path: "guestTag",
				element: <GuestTagPage />,
			},
			{
				path: "guest",
				element: <GuestPage />,
			},
			{
				path: "companyInfo",
				element: <CompanyInfoPage />,
			},
			{
				path: "*",
				element: <NotFoundPage />,
			},
		],
	},
]);
