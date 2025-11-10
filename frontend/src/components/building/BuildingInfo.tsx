import { Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { selectedBuildingAtom } from "../../state/building";

const BuildingInfo = () => {
	const selectedBuilding = useAtomValue(selectedBuildingAtom);

	return <Box component="pre">{JSON.stringify(selectedBuilding, null, 2)}</Box>;

	// if (!selectedBuilding) {
	// 	return (
	// 		<Box p={3}>
	// 			<Typography variant="h6" color="text.secondary">
	// 				No building selected
	// 			</Typography>
	// 		</Box>
	// 	);
	// }

	// const InfoItem = ({
	// 	icon,
	// 	label,
	// 	value,
	// }: {
	// 	icon: React.ReactNode;
	// 	label: string;
	// 	value: string | number | undefined;
	// }) => (
	// 	<Box display="flex" alignItems="center" gap={1.5} mb={2}>
	// 		<Box color="primary.main" display="flex" alignItems="center">
	// 			{icon}
	// 		</Box>
	// 		<Box flex={1}>
	// 			<Typography variant="caption" color="text.secondary" display="block">
	// 				{label}
	// 			</Typography>
	// 			<Typography variant="body1" fontWeight={500}>
	// 				{value || "—"}
	// 			</Typography>
	// 		</Box>
	// 	</Box>
	// );

	// return (
	// 	<Box sx={{ width: "100%", height: "100%", overflow: "auto", p: 3 }}>
	// 		<Stack spacing={3}>
	// 			{/* Header */}
	// 			<Box>
	// 				<Box display="flex" alignItems="center" gap={2} mb={1}>
	// 					<Business fontSize="large" color="primary" />
	// 					<Typography variant="h4" fontWeight={600}>
	// 						{selectedBuilding.name}
	// 					</Typography>
	// 				</Box>
	// 				<Box display="flex" gap={1} alignItems="center">
	// 					<Chip
	// 						label={selectedBuilding.active ? "Active" : "Inactive"}
	// 						color={selectedBuilding.active ? "success" : "default"}
	// 						size="small"
	// 					/>
	// 					<Typography variant="caption" color="text.secondary">
	// 						Created {dateToString(selectedBuilding.createdAt)}
	// 					</Typography>
	// 				</Box>
	// 			</Box>

	// 			<Divider />

	// 			{/* Location Information */}
	// 			<Card variant="outlined">
	// 				<CardContent>
	// 					<Typography variant="h6" fontWeight={600} mb={2}>
	// 						Location Details
	// 					</Typography>
	// 					<Grid container spacing={2}>
	// 						<Grid size={12}>
	// 							<InfoItem
	// 								icon={<Home />}
	// 								label="Address"
	// 								value={selectedBuilding.address}
	// 							/>
	// 						</Grid>
	// 						<Grid size={{ xs: 12, sm: 6 }}>
	// 							<InfoItem
	// 								icon={<LocationCity />}
	// 								label="City"
	// 								value={selectedBuilding.city}
	// 							/>
	// 						</Grid>
	// 						<Grid size={{ xs: 12, sm: 6 }}>
	// 							<InfoItem
	// 								icon={<Public />}
	// 								label="Country"
	// 								value={selectedBuilding.country}
	// 							/>
	// 						</Grid>
	// 						<Grid size={{ xs: 12, sm: 6 }}>
	// 							<InfoItem
	// 								icon={<LocationCity />}
	// 								label="Zipcode"
	// 								value={selectedBuilding.zipcode}
	// 							/>
	// 						</Grid>
	// 					</Grid>
	// 				</CardContent>
	// 			</Card>

	// 			{/* Contact Information */}
	// 			<Card variant="outlined">
	// 				<CardContent>
	// 					<Typography variant="h6" fontWeight={600} mb={2}>
	// 						Contact Information
	// 					</Typography>
	// 					<Grid container spacing={2}>
	// 						<Grid size={{ xs: 12, sm: 6 }}>
	// 							<InfoItem
	// 								icon={<Phone />}
	// 								label="Phone"
	// 								value={selectedBuilding.phoneNumber}
	// 							/>
	// 						</Grid>
	// 						<Grid size={{ xs: 12, sm: 6 }}>
	// 							<InfoItem
	// 								icon={<Email />}
	// 								label="Email"
	// 								value={selectedBuilding.email}
	// 							/>
	// 						</Grid>
	// 					</Grid>
	// 				</CardContent>
	// 			</Card>

	// 			{/* Description */}
	// 			{selectedBuilding.description && (
	// 				<Card variant="outlined">
	// 					<CardContent>
	// 						<Typography variant="h6" fontWeight={600} mb={2}>
	// 							Description
	// 						</Typography>
	// 						<Typography variant="body2" color="text.secondary">
	// 							{selectedBuilding.description}
	// 						</Typography>
	// 					</CardContent>
	// 				</Card>
	// 			)}

	// 			{/* Rooms */}
	// 			<Card variant="outlined">
	// 				<CardContent>
	// 					<Box display="flex" alignItems="center" gap={1.5} mb={2}>
	// 						<MeetingRoom color="primary" />
	// 						<Typography variant="h6" fontWeight={600}>
	// 							Rooms
	// 						</Typography>
	// 						{!loadingRooms && (
	// 							<Chip label={rooms.length} size="small" color="primary" />
	// 						)}
	// 					</Box>
	// 					{loadingRooms ? (
	// 						<Stack spacing={1}>
	// 							<Skeleton variant="rectangular" height={40} />
	// 							<Skeleton variant="rectangular" height={40} />
	// 							<Skeleton variant="rectangular" height={40} />
	// 						</Stack>
	// 					) : rooms.length > 0 ? (
	// 						<Box>
	// 							<Grid container spacing={1}>
	// 								{rooms.map((room) => (
	// 									<Grid size={{ xs: 6, sm: 4, md: 3 }} key={room.id}>
	// 										<Card
	// 											variant="outlined"
	// 											sx={{
	// 												bgcolor: "background.default",
	// 												transition: "all 0.2s",
	// 												"&:hover": {
	// 													bgcolor: "action.hover",
	// 													transform: "translateY(-2px)",
	// 													boxShadow: 1,
	// 												},
	// 											}}
	// 										>
	// 											<CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
	// 												<Typography variant="body2" fontWeight={600}>
	// 													{room.roomNumber}
	// 												</Typography>
	// 												<Typography variant="caption" color="text.secondary">
	// 													Floor {room.floorNumber}
	// 												</Typography>
	// 											</CardContent>
	// 										</Card>
	// 									</Grid>
	// 								))}
	// 							</Grid>
	// 						</Box>
	// 					) : (
	// 						<Typography variant="body2" color="text.secondary">
	// 							No rooms found in this building
	// 						</Typography>
	// 					)}
	// 				</CardContent>
	// 			</Card>

	// 			{/* Users */}
	// 			<Card variant="outlined">
	// 				<CardContent>
	// 					<Box display="flex" alignItems="center" gap={1.5} mb={2}>
	// 						<Group color="primary" />
	// 						<Typography variant="h6" fontWeight={600}>
	// 							Staff Members
	// 						</Typography>
	// 						{!loadingUsers && (
	// 							<Chip label={users.length} size="small" color="primary" />
	// 						)}
	// 					</Box>
	// 					{loadingUsers ? (
	// 						<Stack spacing={1}>
	// 							<Skeleton variant="rectangular" height={60} />
	// 							<Skeleton variant="rectangular" height={60} />
	// 							<Skeleton variant="rectangular" height={60} />
	// 						</Stack>
	// 					) : users.length > 0 ? (
	// 						<Stack spacing={1.5}>
	// 							{users.map((user) => (
	// 								<Card
	// 									key={user.id}
	// 									variant="outlined"
	// 									sx={{
	// 										bgcolor: "background.default",
	// 										transition: "all 0.2s",
	// 										"&:hover": {
	// 											bgcolor: "action.hover",
	// 											transform: "translateX(4px)",
	// 										},
	// 									}}
	// 								>
	// 									<CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
	// 										<Box
	// 											display="flex"
	// 											justifyContent="space-between"
	// 											alignItems="center"
	// 										>
	// 											<Box>
	// 												<Typography variant="body1" fontWeight={600}>
	// 													{user.firstName} {user.lastName}
	// 												</Typography>
	// 												<Typography variant="body2" color="text.secondary">
	// 													{user.email}
	// 												</Typography>
	// 												<Typography variant="caption" color="text.secondary">
	// 													{user.phone}
	// 												</Typography>
	// 											</Box>
	// 											<Box>
	// 												<Chip
	// 													label={user.active ? "Active" : "Inactive"}
	// 													size="small"
	// 													color={user.active ? "success" : "default"}
	// 												/>
	// 											</Box>
	// 										</Box>
	// 										{user.roles && user.roles.length > 0 && (
	// 											<Box mt={1} display="flex" gap={0.5} flexWrap="wrap">
	// 												{user.roles.map((role) => (
	// 													<Chip
	// 														key={role.id}
	// 														label={role.name}
	// 														size="small"
	// 														variant="outlined"
	// 													/>
	// 												))}
	// 											</Box>
	// 										)}
	// 									</CardContent>
	// 								</Card>
	// 							))}
	// 						</Stack>
	// 					) : (
	// 						<Typography variant="body2" color="text.secondary">
	// 							No staff members assigned to this building
	// 						</Typography>
	// 					)}
	// 				</CardContent>
	// 			</Card>

	// 			{/* Metadata */}
	// 			<Card variant="outlined">
	// 				<CardContent>
	// 					<Typography variant="h6" fontWeight={600} mb={2}>
	// 						Metadata
	// 					</Typography>
	// 					<Grid container spacing={2}>
	// 						<Grid size={{ xs: 12, sm: 6 }}>
	// 							<Typography variant="caption" color="text.secondary">
	// 								Created At
	// 							</Typography>
	// 							<Typography variant="body2">
	// 								{dateToString(selectedBuilding.createdAt)}
	// 							</Typography>
	// 						</Grid>
	// 						{selectedBuilding.updatedAt && (
	// 							<Grid size={{ xs: 12, sm: 6 }}>
	// 								<Typography variant="caption" color="text.secondary">
	// 									Last Updated
	// 								</Typography>
	// 								<Typography variant="body2">
	// 									{dateToString(selectedBuilding.updatedAt)}
	// 								</Typography>
	// 							</Grid>
	// 						)}
	// 						<Grid size={{ xs: 12, sm: 6 }}>
	// 							<Typography variant="caption" color="text.secondary">
	// 								Building ID
	// 							</Typography>
	// 							<Typography variant="body2" fontFamily="monospace">
	// 								{selectedBuilding.id}
	// 							</Typography>
	// 						</Grid>
	// 					</Grid>
	// 				</CardContent>
	// 			</Card>
	// 		</Stack>
	// 	</Box>
	// );
};

export default BuildingInfo;
