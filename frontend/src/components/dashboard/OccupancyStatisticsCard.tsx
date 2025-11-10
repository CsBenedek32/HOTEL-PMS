import { Box, Stack, Typography, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAtom, useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import {
	LoadableOccupancyStatsAtom,
	occupancyEndDateAtom,
	occupancyStartDateAtom,
} from "../../state/statistics";
import { DATE_FORMAT } from "../../utils/dateUtils";
import { StatisticsCard } from "./StatisticsCard";

export const OccupancyStatisticsCard = () => {
	const occupancyStats = useAtomValue(LoadableOccupancyStatsAtom);
	const [selectedStartDate, setSelectedStartDate] = useAtom(
		occupancyStartDateAtom,
	);
	const [selectedEndDate, setSelectedEndDate] = useAtom(occupancyEndDateAtom);
	const theme = useTheme();
	const { t } = useTranslation();

	if (occupancyStats.state !== "hasData" || !occupancyStats.data) {
		return (
			<StatisticsCard title={t("statistics.occupancyStatistics")}>
				<Typography variant="body2" color="text.secondary">
					{t("common.loading")}
				</Typography>
			</StatisticsCard>
		);
	}

	const { dailyStats, maxCapacity } = occupancyStats.data;

	const dates = Object.keys(dailyStats).sort();
	const occupiedData = dates.map((date) => dailyStats[date].occupied);
	const availableData = dates.map((date) => dailyStats[date].available);

	const formattedDates = dates.map((date) => {
		const d = new Date(date);
		return `${d.getMonth() + 1}/${d.getDate()}`;
	});

	const totalOccupied = occupiedData.reduce((sum, val) => sum + val, 0);
	const totalAvailable = availableData.reduce((sum, val) => sum + val, 0);
	const avgOccupancyRate =
		totalAvailable > 0
			? (totalOccupied / (totalOccupied + totalAvailable)) * 100
			: 0;

	return (
		<StatisticsCard title={t("statistics.occupancyStatistics")}>
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
							{t("statistics.maxCapacity")}: {maxCapacity}
						</Typography>
					</Box>
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
							{t("statistics.avgOccupancy")}: {avgOccupancyRate.toFixed(1)}%
						</Typography>
					</Box>
				</Stack>

				<LineChart
					xAxis={[{ scaleType: "point", data: formattedDates }]}
					yAxis={[{}]}
					series={[
						{
							data: occupiedData,
							label: t("statistics.occupied"),
							color: theme.palette.primary.main,
						},
						{
							data: availableData,
							label: t("statistics.available"),
							color: theme.palette.success.main,
						},
					]}
					height={300}
					margin={{ top: 10, right: 10, bottom: 30, left: 60 }}
					disableAxisListener
				/>
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
						maxDate={selectedEndDate}
						format={DATE_FORMAT}
						onChange={(newValue) => newValue && setSelectedStartDate(newValue)}
						slotProps={{
							textField: {
								size: "small",
							},
						}}
					/>
					<DatePicker
						label={t("statistics.endDate")}
						format={DATE_FORMAT}
						value={selectedEndDate}
						minDate={selectedStartDate}
						onChange={(newValue) => newValue && setSelectedEndDate(newValue)}
						slotProps={{
							textField: {
								size: "small",
							},
						}}
					/>
				</Stack>
			</Box>
		</StatisticsCard>
	);
};
