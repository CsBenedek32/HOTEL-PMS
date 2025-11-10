import { Box, CircularProgress } from "@mui/material";
import { Outlet, useNavigation } from "react-router";
import { ErrorAlert } from "./ErrorAlert";
import NavigationDrawer from "./NavDrawer";
import { SuccessAlert } from "./SuccessAlert";

function Layout() {
	const navigation = useNavigation();
	const isNavigating = navigation.state === "loading";

	return (
		<Box
			sx={{
				display: "flex",
				position: "relative",
				height: "100vh",
				overflowX: "hidden",
				overflowY: "hidden",
			}}
		>
			<NavigationDrawer />

			<ErrorAlert />
			<SuccessAlert />

			<Box
				sx={{
					flexGrow: 1,
					position: "relative",
					ml: "80px",
					mr: "0",
					alignContent: "center",
					alignItems: "center",
					verticalAlign: "center",
					overflow: "auto",
				}}
			>
				{isNavigating ? (
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "100%",
						}}
					>
						<CircularProgress />
					</Box>
				) : (
					<Outlet />
				)}
			</Box>
		</Box>
	);
}

export default Layout;
