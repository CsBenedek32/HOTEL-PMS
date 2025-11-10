import { Box, Stack, type Theme, Typography, useTheme } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { LoadableBookingStatsAtom } from "../../state/statistics";
import { DATE_FORMAT, dateToString } from "../../utils/dateUtils";
import { getBookingStatusColor } from "../../utils/statusUtils";
import { StatisticsCard } from "./StatisticsCard";

const getColorFromStatus = (status: string, theme: Theme): string => {
	const colorType = getBookingStatusColor(status);
	switch (colorType) {
		case "success":
			return theme.palette.success.main;
		case "info":
			return theme.palette.info.main;
		case "warning":
			return theme.palette.warning.main;
		case "error":
			return theme.palette.error.main;
		case "primary":
			return theme.palette.primary.main;
		case "secondary":
			return theme.palette.secondary.main;
		default:
			return theme.palette.grey[500];
	}
};


export const BookingStatisticsCard = () => {
	const bookingStats = useAtomValue(LoadableBookingStatsAtom);
	const theme = useTheme();
	const { t } = useTranslation();

	if (bookingStats.state !== "hasData" || !bookingStats.data) {
		return (
			<StatisticsCard title={t("statistics.bookingStatistics")}>
				<Typography variant="body2" color="text.secondary">
					{t("common.loading")}
				</Typography>
			</StatisticsCard>
		);
	}

	const { totalNumberOfBookings, countByStatus, date } = bookingStats.data;

	const pieData = Object.entries(countByStatus).map(([status, count]) => ({
		id: status,
		value: count,
		label: t(`enums.bookingStatus.${status}`),
		color: getColorFromStatus(status, theme),
	}));

	return (
		<StatisticsCard title={t("statistics.bookingStatistics")}>
			<Box>
				<Stack
					direction={"row"}
					justifyContent="space-between"
					alignItems="center"
				>
					<Typography variant="body2" fontWeight={600} gutterBottom>
						{t("statistics.totalBookings")}: {totalNumberOfBookings}
					</Typography>
					<Typography variant="body2" color="text.secondary" gutterBottom>
						{dateToString(date, DATE_FORMAT)}
					</Typography>
				</Stack>

				{pieData.length > 0 && (
					<Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
						<PieChart
							series={[
								{
									innerRadius: 50,
									outerRadius: 100,
									paddingAngle: 2,
									arcLabel: "value",
									data: pieData,
									highlightScope: { fade: "global", highlight: "item" },
								},
							]}
							height={200}
						/>
					</Box>
				)}
			</Box>
		</StatisticsCard>
	);
};
