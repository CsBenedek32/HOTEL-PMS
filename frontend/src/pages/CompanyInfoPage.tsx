import { Business, CameraAlt, Edit, Gavel, Phone } from "@mui/icons-material";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { postCompanyInfo } from "../api/companyInfoApi";
import {
	DetailsSection,
	InfoSection,
} from "../components/common/InfoDrawerComponents";
import { companyInfoFormConfig } from "../config/forms/companyInfoForm";
import type { CompanyInfoFormData } from "../interfaces/companyInfo";
import { FormModal, type FormValues } from "../lib/form";
import { LoadingScreen } from "../lib/loading";
import { reloadTimestampAtom } from "../state/common";
import { LoadableCompanyInfoAtom } from "../state/companyInfo";
import {
	formModalConfigAtom,
	formModalInitialValuesAtom,
	formModalOnSubmitAtom,
	formModalOpenAtom,
	formModalTitleAtom,
} from "../state/formModal";
import ButtonUI from "../lib/ButtonUi";

function CompanyInfoPage() {
	const loadValue = useAtomValue(LoadableCompanyInfoAtom);
	const { t } = useTranslation();
	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);
	const setFormModalOpen = useSetAtom(formModalOpenAtom);
	const setTitle = useSetAtom(formModalTitleAtom);
	const setConfig = useSetAtom(formModalConfigAtom);
	const setInitialValues = useSetAtom(formModalInitialValuesAtom);
	const setOnSubmit = useSetAtom(formModalOnSubmitAtom);

	const handleSubmit = async (values: CompanyInfoFormData) => {
		const res = await postCompanyInfo(values);
		if (!res.error) {
			setReloadTimestamp(Date.now());
			setFormModalOpen(false);
		}
	};

	const handleEdit = () => {
		setTitle(t("companyInfo.editTitle"));
		setConfig(companyInfoFormConfig);
		setInitialValues(
			loadValue.state === "hasData" && loadValue.data
				? {
					companyName: loadValue.data.companyName || "",
					address: loadValue.data.address || "",
					phone: loadValue.data.phone || "",
					email: loadValue.data.email || "",
					website: loadValue.data.website || "",
					logoUrl: loadValue.data.logoUrl || "",
					taxNumber: loadValue.data.taxNumber || "",
					registrationNumber: loadValue.data.registrationNumber || "",
				}
				: {},
		);
		setOnSubmit(() => handleSubmit as (values: FormValues) => Promise<void>);
		setFormModalOpen(true);
	};

	if (loadValue.state === "loading") {
		return <LoadingScreen />;
	}

	const companyInfo = loadValue.state === "hasData" ? loadValue.data : null;

	if (!companyInfo) {
		return (
			<>
				<FormModal />
				<Box sx={{ p: 3, maxWidth: "1200px", margin: "0 auto" }}>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						mb={3}
					>
						<Box display="flex" alignItems="center" gap={2}>
							<Business fontSize="large" color="primary" />
							<Typography variant="h4" fontWeight={600}>
								{t("companyInfo.title")}
							</Typography>
						</Box>
						<Button
							variant="contained"
							color="primary"
							startIcon={<Edit />}
							onClick={handleEdit}
						>
							{t("companyInfo.create")}
						</Button>
					</Box>
					<InfoSection title={t("companyInfo.noData")}>
						<Typography variant="body2" color="text.secondary">
							Click 'Create Company Info' to add your company details.
						</Typography>
					</InfoSection>
				</Box>
			</>
		);
	}

	return (
		<>
			<FormModal />
			<Box
				sx={{
					width: "100%",
					height: "100%",
					overflow: "auto",
					p: 3,
					display: "flex",
					justifyContent: "center",
				}}
			>
				<Box sx={{ maxWidth: "800px", width: "100%" }}>
					<Stack spacing={3}>
						<Box>
							<Box display="flex" alignItems="center" gap={2} mb={1}>
								<Business fontSize="large" color="primary" />
								<Typography variant="h4" fontWeight={600}>
									{companyInfo.companyName}
								</Typography>
								<Box ml="auto">

									<ButtonUI
										color="primary"
										startIcon={<Edit />}
										label={t("companyInfo.edit")}
										onClick={handleEdit}
										requiredPermissions={["Admin", "Data Manager"]}
										variant="contained"
									/>
								</Box>
							</Box>
						</Box>
						<Divider />
						<DetailsSection
							title={t("companyInfo.basicInfo")}
							icon={<Business color="primary" />}
							details={[
								{
									label: t("companyInfo.companyName"),
									value: companyInfo.companyName,
								},
								{
									label: t("companyInfo.address"),
									value: companyInfo.address,
								},
							]}
						/>

						<DetailsSection
							title={t("companyInfo.contactInfo")}
							icon={<Phone color="primary" />}
							details={[
								{
									label: t("companyInfo.phone"),
									value: companyInfo.phone,
								},
								{
									label: t("companyInfo.email"),
									value: companyInfo.email,
								},
								...(companyInfo.website
									? [
										{
											label: t("companyInfo.website"),
											value: companyInfo.website,
										},
									]
									: []),
							]}
						/>

						{(companyInfo.taxNumber || companyInfo.registrationNumber) && (
							<DetailsSection
								title={t("companyInfo.legalInfo")}
								icon={<Gavel color="primary" />}
								details={[
									...(companyInfo.taxNumber
										? [
											{
												label: t("companyInfo.taxNumber"),
												value: companyInfo.taxNumber,
											},
										]
										: []),
									...(companyInfo.registrationNumber
										? [
											{
												label: t("companyInfo.registrationNumber"),
												value: companyInfo.registrationNumber,
											},
										]
										: []),
								]}
							/>
						)}

						{companyInfo.logoUrl && (
							<InfoSection
								title={t("companyInfo.logo")}
								icon={<CameraAlt color="primary" />}
							>
								<Box
									component="img"
									src={companyInfo.logoUrl}
									alt="Company Logo"
									sx={{
										maxWidth: "300px",
										maxHeight: "150px",
										objectFit: "contain",
									}}
								/>
							</InfoSection>
						)}
					</Stack>
				</Box>
			</Box>
		</>
	);
}

export default CompanyInfoPage;
