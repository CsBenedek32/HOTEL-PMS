import { Login } from "@mui/icons-material";
import {
	Box,
	Card,
	CardContent,
	Link,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router";
import { login } from "../api/api";
import type { LoginCredentials } from "../interfaces/api";
import ButtonUI from "../lib/ButtonUi";
import { ErrorScreen } from "../lib/error";
import { LoadingScreen } from "../lib/loading";
import { LoadableCompanyInfoAtom } from "../state/companyInfo";

function LoginPage() {
	const { t } = useTranslation();
	const companyInfo = useAtomValue(LoadableCompanyInfoAtom);
	const [credentials, setCredentials] = useState<LoginCredentials>({
		email: "",
		password: "",
	});
	const navigation = useNavigate();

	const handleSubmit = async () => {

		const res = await login(credentials);
		if (!res.error) {
			navigation("/");
		} else if (res.message === "AUTH_005") {
			navigation("/account-inactive");
		}
	};

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
				background: "backround.paper",
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
						<Typography variant="h4">
							{companyInfo.data?.companyName || t("login.defaultTitle")}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{t("login.subtitle")}
						</Typography>
						<Box sx={{ width: "100%" }}>
							<Stack spacing={2}>
								<TextField
									label={t("login.email")}
									type="email"
									value={credentials.email}
									onChange={(e) =>
										setCredentials({ ...credentials, email: e.target.value })
									}
									required
									fullWidth
									autoComplete="email"
									autoFocus
								/>
								<TextField
									label={t("login.password")}
									type="password"
									value={credentials.password}
									onChange={(e) =>
										setCredentials({ ...credentials, password: e.target.value })
									}
									required
									fullWidth
									autoComplete="current-password"
								/>
								<ButtonUI
									color="primary"
									startIcon={<Login />}
									label={t("login.signIn")}
									onClick={handleSubmit}
									disabled={
										credentials.email.trim() === "" ||
										credentials.password.trim() === ""
									}
									fullWidth
									variant="contained"
								/>
								<Box sx={{ mt: 2 }}>
									<Typography variant="body2" color="text.secondary">
										{t("login.noAccount")}{" "}
										<Link
											component={RouterLink}
											to="/register"
											sx={{
												textDecoration: "none",
												fontWeight: 600,
												"&:hover": {
													textDecoration: "underline",
												},
											}}
										>
											{t("login.signUpLink")}
										</Link>
									</Typography>
								</Box>
							</Stack>
						</Box>

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

export default LoginPage;
