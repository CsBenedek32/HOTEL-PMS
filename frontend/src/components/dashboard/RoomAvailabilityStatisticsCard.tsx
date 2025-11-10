import BookmarkIcon from "@mui/icons-material/Bookmark";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import HotelIcon from "@mui/icons-material/Hotel";
import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { LoadableRoomAvailabilityStatsAtom } from "../../state/statistics";
import { DATE_FORMAT, dateToString } from "../../utils/dateUtils";
import { StatisticsCard } from "./StatisticsCard";

export const RoomAvailabilityStatisticsCard = () => {
	const roomAvailabilityStats = useAtomValue(LoadableRoomAvailabilityStatsAtom);
	const theme = useTheme();
	const { t } = useTranslation();

	if (
		roomAvailabilityStats.state !== "hasData" ||
		!roomAvailabilityStats.data
	) {
		return (
			<StatisticsCard title={t("statistics.roomAvailability")}>
				<Typography variant="body2" color="text.secondary">
					{t("common.loading")}
				</Typography>
			</StatisticsCard>
		);
	}

	const { availabilityByRoomType, date } = roomAvailabilityStats.data;

	return (
		<StatisticsCard title={t("statistics.roomAvailability")}>
			<Box>
				<Typography variant="body2" color="text.secondary" gutterBottom>
					{dateToString(date, DATE_FORMAT)}
				</Typography>

				<Stack spacing={2} sx={{ mt: 2 }}>
					{Object.entries(availabilityByRoomType).map(([roomType, stats]) => {
						const availabilityPercentage =
							stats.totalRooms > 0
								? Math.round((stats.available / stats.totalRooms) * 100)
								: 0;

						return (
							<Box
								key={roomType}
								sx={{
									p: 1,
									borderRadius: 2,
									backgroundColor: theme.palette.background.default,
									border: `1px solid ${theme.palette.divider}`,
								}}
							>
								<Stack spacing={1}>
									<Stack
										direction="row"
										justifyContent="space-between"
										alignItems="center"
									>
										<Typography variant="subtitle2" fontWeight={600}>
											{roomType}
										</Typography>
										<Chip
											label={`${availabilityPercentage}%`}
											size="small"
											color={
												availabilityPercentage >= 50
													? "success"
													: availabilityPercentage >= 25
														? "warning"
														: "error"
											}
										/>
									</Stack>

									<Stack direction="row" spacing={2} flexWrap="wrap">
										<Box
											sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
										>
											<CheckCircleIcon
												sx={{
													fontSize: 16,
													color: theme.palette.success.main,
												}}
											/>
											<Typography variant="caption" color="text.secondary">
												{t("statistics.available")}: {stats.available}
											</Typography>
										</Box>

										<Box
											sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
										>
											<BookmarkIcon
												sx={{
													fontSize: 16,
													color: theme.palette.info.main,
												}}
											/>
											<Typography variant="caption" color="text.secondary">
												{t("statistics.reserved")}: {stats.reserved}
											</Typography>
										</Box>

										<Box
											sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
										>
											<EventBusyIcon
												sx={{
													fontSize: 16,
													color: theme.palette.error.main,
												}}
											/>
											<Typography variant="caption" color="text.secondary">
												{t("statistics.unavailable")}: {stats.unavailable}
											</Typography>
										</Box>

										<Box
											sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
										>
											<HotelIcon
												sx={{
													fontSize: 16,
													color: theme.palette.text.primary,
												}}
											/>
											<Typography variant="caption" color="text.secondary">
												{t("statistics.total")}: {stats.totalRooms}
											</Typography>
										</Box>
									</Stack>
								</Stack>
							</Box>
						);
					})}
				</Stack>
			</Box>
		</StatisticsCard>
	);
};
