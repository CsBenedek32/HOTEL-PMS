import {
	Box,
	Button,
	Card,
	CardContent,
	Stack,
	Typography,
} from "@mui/material";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { ErrorScreen } from "../lib/error";
import { LoadingScreen } from "../lib/loading";
import { LoadableCompanyInfoAtom } from "../state/companyInfo";

function AccountInactivePage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const companyInfo = useAtomValue(LoadableCompanyInfoAtom);

	return companyInfo.state === "loading" ? (
		<LoadingScreen />
	) : companyInfo.state === "hasError" ? (
		<ErrorScreen />
	) : (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "background.paper",
				p: 2,
			}}
		>
			<Card
				sx={{
					maxWidth: 450,
					width: "100%",
					boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
					textAlign: "center",
				}}
			>
				<CardContent sx={{ p: 4 }}>
					<Stack spacing={3} alignItems="center">
						<Box
							component="img"
							src={companyInfo.data?.logoUrl || "/logo.png"}
							alt={companyInfo.data?.companyName || "Company Logo"}
							sx={{
								height: 150,
								objectFit: "contain",
							}}
						/>

						<Typography variant="h4" fontWeight={600}>
							{companyInfo.data?.companyName ||
								t("accountInactive.defaultTitle")}
						</Typography>

						<Typography variant="h5" color="warning.main" fontWeight={500}>
							{t("accountInactive.title")}
						</Typography>

						<Typography
							variant="body1"
							color="text.secondary"
							sx={{ maxWidth: 400 }}
						>
							{t("accountInactive.message")}
						</Typography>

						<Button
							variant="contained"
							size="large"
							fullWidth
							onClick={() => navigate("/login")}
							sx={{
								mt: 2,
								py: 1.5,
								textTransform: "none",
								fontSize: "1rem",
							}}
						>
							{t("accountInactive.backToLogin")}
						</Button>

						<Stack sx={{ mt: 2 }}>
							<Typography
								variant="caption"
								color="text.secondary"
								align="center"
								display="block"
							>
								{companyInfo.data?.email}
							</Typography>
							<Typography
								variant="caption"
								color="text.secondary"
								align="center"
								display="block"
							>
								{companyInfo.data?.website}
							</Typography>
						</Stack>
					</Stack>
				</CardContent>
			</Card>
		</Box>
	);
}

export default AccountInactivePage;
