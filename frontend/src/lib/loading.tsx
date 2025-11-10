import { Box, CircularProgress } from "@mui/material";

export const LoadingScreen = () => {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<CircularProgress />
		</Box>
	);
};
