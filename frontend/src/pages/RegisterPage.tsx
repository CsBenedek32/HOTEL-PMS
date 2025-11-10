import {
	Box,
	Button,
	Card,
	CardContent,
	Grid,
	Link,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router";
import { register } from "../api/api";
import { getCompanyInfo } from "../api/companyInfoApi";
import type { CompanyInfoData } from "../interfaces/companyInfo";
import type { RegisterFormData } from "../interfaces/user";
import { errorMessageTranslationKeyAtom } from "../state/operationState";

function RegisterPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const setErrorMessage = useSetAtom(errorMessageTranslationKeyAtom);
	const [formData, setFormData] = useState<RegisterFormData>({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
	});

	const [companyInfo, setCompanyInfo] = useState<CompanyInfoData | null>(null);

	useEffect(() => {
		const fetchCompanyInfo = async () => {
			try {
				const info = await getCompanyInfo();
				setCompanyInfo(info || null);
			} catch (err) {
				console.error("Failed to fetch company info:", err);
			}
		};
		fetchCompanyInfo();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			setErrorMessage("register.passwordMismatchAlert");
			return;
		}

		try {
			const response = await register({
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				phone: formData.phone,
				password: formData.password,
			});

			if (!response.error) {
				navigate("/account-inactive");
			}
		} catch (err) {
			console.log("Registration failed:", err);
		}
	};

	return (
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
							src={companyInfo?.logoUrl || "/logo.png"}
							alt={companyInfo?.companyName || "Company Logo"}
							sx={{
								height: 150,
								objectFit: "contain",
							}}
						/>

						<Typography variant="h4" fontWeight={600}>
							{companyInfo?.companyName || t("register.defaultTitle")}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{t("register.subtitle")}
						</Typography>

						<Box
							component="form"
							onSubmit={handleSubmit}
							sx={{ width: "100%" }}
						>
							<Stack spacing={2}>
								<Grid container spacing={0.5}>
									<Grid size={6}>
										<TextField
											label={t("register.firstName")}
											type="text"
											value={formData.firstName}
											onChange={(e) =>
												setFormData({ ...formData, firstName: e.target.value })
											}
											required
											fullWidth
											autoComplete="given-name"
											autoFocus
										/>
									</Grid>
									<Grid size={6}>
										<TextField
											label={t("register.lastName")}
											type="text"
											value={formData.lastName}
											onChange={(e) =>
												setFormData({ ...formData, lastName: e.target.value })
											}
											required
											fullWidth
											autoComplete="family-name"
										/>
									</Grid>
								</Grid>
								<TextField
									label={t("register.email")}
									type="email"
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									required
									fullWidth
									autoComplete="email"
								/>

								<TextField
									label={t("register.phone")}
									type="tel"
									value={formData.phone}
									onChange={(e) =>
										setFormData({ ...formData, phone: e.target.value })
									}
									required
									fullWidth
									autoComplete="tel"
								/>
								<Grid container spacing={0.5}>
									<Grid size={6}>
										<TextField
											label={t("register.password")}
											type="password"
											value={formData.password}
											onChange={(e) =>
												setFormData({ ...formData, password: e.target.value })
											}
											required
											fullWidth
											autoComplete="new-password"
										/>
									</Grid>
									<Grid size={6}>
										<TextField
											label={t("register.confirmPassword")}
											type="password"
											value={formData.confirmPassword}
											onChange={(e) =>
												setFormData({
													...formData,
													confirmPassword: e.target.value,
												})
											}
											required
											fullWidth
											autoComplete="new-password"
										/>
									</Grid>
								</Grid>
								<Button
									type="submit"
									variant="contained"
									size="large"
									fullWidth
									sx={{
										mt: 2,
										py: 1.5,
										textTransform: "none",
										fontSize: "1rem",
									}}
								>
									{t("register.signUp")}
								</Button>

								<Box sx={{ textAlign: "center", mt: 2 }}>
									<Typography variant="body2" color="text.secondary">
										{t("register.alreadyHaveAccount")}{" "}
										<Link
											component={RouterLink}
											to="/login"
											sx={{
												textDecoration: "none",
												fontWeight: 600,
												"&:hover": {
													textDecoration: "underline",
												},
											}}
										>
											{t("register.signInLink")}
										</Link>
									</Typography>
								</Box>
							</Stack>
						</Box>

						{companyInfo && (
							<Box sx={{ mt: 2 }}>
								<Typography
									variant="caption"
									color="text.secondary"
									align="center"
									display="block"
								>
									{companyInfo.email}
								</Typography>
								{companyInfo.website && (
									<Typography
										variant="caption"
										color="text.secondary"
										align="center"
										display="block"
									>
										{companyInfo.website}
									</Typography>
								)}
							</Box>
						)}
					</Stack>
				</CardContent>
			</Card>
		</Box>
	);
}

export default RegisterPage;
