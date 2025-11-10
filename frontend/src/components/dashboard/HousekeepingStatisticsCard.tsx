import { Box, Stack, type Theme, Typography, useTheme } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { RoomStatus } from "../../interfaces/enums";
import { LoadableHousekeepingStatsAtom } from "../../state/statistics";
import { DATE_FORMAT, dateToString } from "../../utils/dateUtils";
import { getRoomStatusColor } from "../../utils/statusUtils";
import { StatisticsCard } from "./StatisticsCard";

const getColorFromRoomStatus = (status: string, theme: Theme): string => {
	const colorType = getRoomStatusColor(status);
	switch (colorType) {
		case "success":
			return theme.palette.success.main;
		case "warning":
			return theme.palette.warning.main;
		case "error":
			return theme.palette.error.main;
		default:
			return theme.palette.grey[500];
	}
};

export const HousekeepingStatisticsCard = () => {
	const housekeepingStats = useAtomValue(LoadableHousekeepingStatsAtom);
	const theme = useTheme();
	const { t } = useTranslation();

	if (housekeepingStats.state !== "hasData" || !housekeepingStats.data) {
		return (
			<StatisticsCard title={t("statistics.housekeepingStatistics")}>
				<Typography variant="body2" color="text.secondary">
					{t("common.loading")}
				</Typography>
			</StatisticsCard>
		);
	}

	const { totalRooms, cleanRooms, dirtyRooms, outOfServiceRooms, date } =
		housekeepingStats.data;

	const pieData = [
		{
			id: RoomStatus.CLEAN,
			value: cleanRooms,
			label: t("statistics.clean"),
			color: getColorFromRoomStatus(RoomStatus.CLEAN, theme),
		},
		{
			id: RoomStatus.DIRTY,
			value: dirtyRooms,
			label: t("statistics.dirty"),
			color: getColorFromRoomStatus(RoomStatus.DIRTY, theme),
		},
		{
			id: RoomStatus.OUT_OF_SERVICE,
			value: outOfServiceRooms,
			label: t("statistics.outOfService"),
			color: getColorFromRoomStatus(RoomStatus.OUT_OF_SERVICE, theme),
		},
	].filter((item) => item.value > 0);

	return (
		<StatisticsCard title={t("statistics.housekeepingStatistics")}>
			<Box>
				<Stack
					direction={"row"}
					justifyContent="space-between"
					alignItems="center"
				>
					<Typography variant="body2" fontWeight={600} gutterBottom>
						{t("statistics.totalRooms")}: {totalRooms}
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
