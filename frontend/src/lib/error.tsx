import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export const ErrorScreen = () => {
	const { t } = useTranslation();
	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Typography variant="h6" color="error">
				{t("common.error")}
			</Typography>
		</Box>
	);
};
