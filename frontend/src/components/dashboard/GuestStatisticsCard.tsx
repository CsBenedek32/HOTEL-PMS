import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { LoadableGuestStatsAtom } from "../../state/statistics";
import { DATE_FORMAT, dateToString } from "../../utils/dateUtils";
import { StatisticsCard } from "./StatisticsCard";

export const GuestStatisticsCard = () => {
	const guestStats = useAtomValue(LoadableGuestStatsAtom);
	const theme = useTheme();
	const { t } = useTranslation();

	if (guestStats.state !== "hasData" || !guestStats.data) {
		return (
			<StatisticsCard title={t("statistics.guestStatistics")}>
				<Typography variant="body2" color="text.secondary">
					{t("common.loading")}
				</Typography>
			</StatisticsCard>
		);
	}

	const { totalGuests, totalAdults, totalChildren, guestsByCountry, date } =
		guestStats.data;

	const countries = Object.keys(guestsByCountry);
	const countryData = countries.map((country) => ({
		country,
		total: guestsByCountry[country].totalGuests,
		adults: guestsByCountry[country].adults,
		children: guestsByCountry[country].children,
	}));

	countryData.sort((a, b) => b.total - a.total);

	return (
		<StatisticsCard title={t("statistics.guestStatistics")}>
			<Box>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
				>
					<Typography variant="body2" fontWeight={600} gutterBottom>
						{t("statistics.totalGuests")}: {totalGuests}
					</Typography>
					<Typography variant="body2" color="text.secondary" gutterBottom>
						{dateToString(date, DATE_FORMAT)}
					</Typography>
				</Stack>

				<Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2 }}>
					<Chip
						label={`${t("statistics.adults")}: ${totalAdults}`}
						color="primary"
						size="small"
						variant="outlined"
					/>
					<Chip
						label={`${t("statistics.children")}: ${totalChildren}`}
						color="secondary"
						size="small"
						variant="outlined"
					/>
				</Stack>

				{countryData.length > 0 && (
					<BarChart
						dataset={countryData}
						series={[
							{
								dataKey: "adults",
								label: t("statistics.adults"),
								color: theme.palette.primary.main,
								stack: "total",
							},
							{
								dataKey: "children",
								label: t("statistics.children"),
								color: theme.palette.secondary.main,
								stack: "total",
							},
						]}
						layout="horizontal"
						height={Math.max(200, countryData.length * 50)}
						xAxis={[
							{
								min: 0,
								max: totalGuests,
								valueFormatter: (value: number) => `${value}%`,
							},
						]}
						yAxis={[
							{
								scaleType: "band",
								dataKey: "country",
								width: 120,
							},
						]}
						barLabel={(v) => {
							return v.value !== 0 ? `${v.value}` : "";
						}}
						axisHighlight={{ x: "none", y: "none" }}
					/>
				)}

				{countryData.length === 0 && (
					<Typography variant="body2" color="text.secondary">
						{t("statistics.noGuestData")}
					</Typography>
				)}
			</Box>
		</StatisticsCard>
	);
};
