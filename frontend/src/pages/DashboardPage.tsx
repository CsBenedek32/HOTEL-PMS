import { Box, Grid, Stack } from "@mui/material";
import { BookingStatisticsCard } from "../components/dashboard/BookingStatisticsCard";
import { GuestStatisticsCard } from "../components/dashboard/GuestStatisticsCard";
import { HousekeepingStatisticsCard } from "../components/dashboard/HousekeepingStatisticsCard";
import { IncomeStatisticsCard } from "../components/dashboard/IncomeStatisticsCard";
import { OccupancyStatisticsCard } from "../components/dashboard/OccupancyStatisticsCard";
import { RoomAvailabilityStatisticsCard } from "../components/dashboard/RoomAvailabilityStatisticsCard";

function DashboardPage() {
	return (
		<Box
			sx={{
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
			}}
		>
			<Box
				sx={{
					flexGrow: 1,
					overflow: "auto",
					p: 3,
				}}
			>
				<Grid container spacing={2}>
					<Grid size={4}>
						<Stack spacing={2}>
							<BookingStatisticsCard />
							<HousekeepingStatisticsCard />
						</Stack>
					</Grid>
					<Grid size={4}>
						<GuestStatisticsCard />
					</Grid>
					<Grid size={4}>
						<RoomAvailabilityStatisticsCard />
					</Grid>
					<Grid size={6}>
						<IncomeStatisticsCard />
					</Grid>
					<Grid size={6}>
						<OccupancyStatisticsCard />
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}

export default DashboardPage;
