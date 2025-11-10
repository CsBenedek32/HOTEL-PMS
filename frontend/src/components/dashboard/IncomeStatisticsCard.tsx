import { Box, Stack, Typography, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAtom, useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import {
	incomeEndDateAtom,
	incomeStartDateAtom,
	LoadableIncomeStatsAtom,
} from "../../state/statistics";
import { DATE_FORMAT } from "../../utils/dateUtils";
import { StatisticsCard } from "./StatisticsCard";

export const IncomeStatisticsCard = () => {
	const incomeStats = useAtomValue(LoadableIncomeStatsAtom);
	const [selectedStartDate, setSelectedStartDate] =
		useAtom(incomeStartDateAtom);
	const [selectedEndDate, setSelectedEndDate] = useAtom(incomeEndDateAtom);
	const theme = useTheme();
	const { t } = useTranslation();

	if (incomeStats.state !== "hasData" || !incomeStats.data) {
		return (
			<StatisticsCard title={t("statistics.incomeStatistics")}>
				<Typography variant="body2" color="text.secondary">
					{t("common.loading")}
				</Typography>
			</StatisticsCard>
		);
	}

	const { dailyStats } = incomeStats.data;

	const dates = Object.keys(dailyStats).sort();
	const incomeData = dates.map((date) => dailyStats[date].totalSum);
	const totalIncome = incomeData.reduce((sum, value) => sum + value, 0);

	const formattedDates = dates.map((date) => {
		const d = new Date(date);
		return `${d.getMonth() + 1}/${d.getDate()}`;
	});

	return (
		<StatisticsCard title={t("statistics.incomeStatistics")}>
			<Box>
				<Stack
					direction="row"
					justifyContent={"flex-end"}
					spacing={2}
					sx={{ mb: 2 }}
					flexWrap="wrap"
				>
					<Box
						sx={{
							p: 1,
							borderRadius: 2,
							backgroundColor: theme.palette.background.default,
							border: `1px solid ${theme.palette.divider}`,
							display: "flex",
							alignItems: "center",
						}}
					>
						<Typography variant="caption" color="text.secondary">
							{t("statistics.total")}: ${totalIncome.toFixed(2)}
						</Typography>
					</Box>
				</Stack>

				<LineChart
					xAxis={[{ scaleType: "point", data: formattedDates }]}
					yAxis={[
						{
							max: Math.max(...incomeData) * 1.1,
							min: 0,
						},
					]}
					series={[
						{
							data: incomeData,
							label: t("statistics.income"),
							color: theme.palette.primary.main,
						},
					]}
					height={300}
					margin={{ top: 10, right: 10, bottom: 30, left: 60 }}
					disableAxisListener
				/>
			</Box>

			<Stack
				direction="row"
				justifyContent={"center"}
				spacing={2}
				sx={{ mb: 2 }}
				flexWrap="wrap"
			>
				<DatePicker
					label={t("statistics.startDate")}
					value={selectedStartDate}
					format={DATE_FORMAT}
					maxDate={selectedEndDate}
					onChange={(newValue) => newValue && setSelectedStartDate(newValue)}
					slotProps={{
						textField: {
							size: "small",
						},
					}}
				/>
				<DatePicker
					label={t("statistics.endDate")}
					value={selectedEndDate}
					minDate={selectedStartDate}
					format={DATE_FORMAT}
					onChange={(newValue) => newValue && setSelectedEndDate(newValue)}
					slotProps={{
						textField: {
							size: "small",
						},
					}}
				/>
			</Stack>
		</StatisticsCard>
	);
};
