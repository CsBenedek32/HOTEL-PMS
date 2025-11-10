import { Box, Chip, Typography } from "@mui/material";
import type {
	MRT_ColumnDef,
	MRT_RowSelectionState,
} from "material-react-table";
import {
	MaterialReactTable,
	useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { MRT_Localization_HU } from "material-react-table/locales/hu";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAvailableRooms } from "../../api/roomApi";
import { RoomStatus } from "../../interfaces/enums";
import type { RoomData } from "../../interfaces/room";
import { getRoomStatusColor } from "../../utils/statusUtils";

interface BookingRoomsStepProps {
	checkInDate: Date;
	checkOutDate: Date;
	selectedRoomIds: number[];
	onRoomSelectionChange: (roomIds: number[]) => void;
	excludeBookingId?: number;
}

export const BookingRoomsStep = ({
	checkInDate,
	checkOutDate,
	selectedRoomIds,
	onRoomSelectionChange,
	excludeBookingId,
}: BookingRoomsStepProps) => {
	const { t, i18n } = useTranslation();
	const localization =
		i18n.language === "hu" ? MRT_Localization_HU : MRT_Localization_EN;
	const [availableRooms, setAvailableRooms] = useState<RoomData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		const fetchAvailableRooms = async () => {
			setIsLoading(true);
			try {
				const rooms = await getAvailableRooms(
					checkInDate,
					checkOutDate,
					excludeBookingId,
				);
				setAvailableRooms(rooms);
			} catch (error) {
				console.log("Error fetching available rooms:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (checkInDate && checkOutDate) {
			fetchAvailableRooms();
		}
	}, [checkInDate, checkOutDate, excludeBookingId]);

	useEffect(() => {
		if (availableRooms.length > 0) {
			const initialSelection: MRT_RowSelectionState = {};
			for (const roomId of selectedRoomIds) {
				const index = availableRooms.findIndex((room) => room.id === roomId);
				if (index !== -1) {
					initialSelection[index] = true;
				}
			}
			setRowSelection(initialSelection);
			setIsInitialized(true);
		}
	}, [availableRooms, selectedRoomIds]);

	// biome-ignore lint/correctness/useExhaustiveDependencies(onRoomSelectionChange): suppress dependency a
	useEffect(() => {
		if (!isInitialized) {
			return;
		}

		const selectedIds = Object.keys(rowSelection)
			.filter((key) => rowSelection[key])
			.map((key) => availableRooms[Number.parseInt(key, 10)]?.id)
			.filter((id): id is number => id !== undefined);

		const currentSorted = JSON.stringify([...selectedIds].sort());
		const previousSorted = JSON.stringify([...selectedRoomIds].sort());

		if (currentSorted !== previousSorted) {
			onRoomSelectionChange(selectedIds);
		}
	}, [rowSelection, availableRooms, selectedRoomIds, isInitialized]);

	const columns = useMemo<MRT_ColumnDef<RoomData>[]>(
		() => [
			{
				accessorKey: "building.name",
				header: `${t("room.building")}`,
				accessorFn: (row) => row.building.name,
			},
			{
				accessorKey: "floorNumber",
				header: `${t("room.floorNumber")}`,
			},
			{
				accessorKey: "roomNumber",
				header: `${t("room.roomNumber")}`,
			},
			{
				accessorKey: "roomType.typeName",
				header: `${t("room.roomType")}`,
				accessorFn: (row) => row.roomType.typeName,
			},
			{
				accessorKey: "status",
				header: `${t("room.status")}`,
				Cell: ({ cell }) => {
					const status = cell.getValue<string>();
					return (
						<Chip
							label={t(`enums.roomStatus.${status}`)}
							color={getRoomStatusColor(status)}
							size="small"
						/>
					);
				},
				filterVariant: "multi-select",
				filterSelectOptions: Object.values(RoomStatus).map((status) => ({
					label: t(`enums.roomStatus.${status}`),
					value: status,
				})),
			},
			{
				accessorKey: "description",
				header: `${t("room.description")}`,
			},
		],
		[t],
	);

	const table = useMaterialReactTable({
		columns,
		data: availableRooms,
		localization,
		enableRowSelection: true,
		enableMultiRowSelection: true,
		onRowSelectionChange: setRowSelection,
		state: {
			rowSelection,
			isLoading,
		},
		enableColumnFilters: true,
		enableGlobalFilter: true,
		enableDensityToggle: false,
		enableFullScreenToggle: false,
		initialState: {
			density: "compact",
			columnVisibility: Object.fromEntries(
				["floorNumber"].map((col) => [col, false]),
			),
		},
		enableStickyHeader: true,
		layoutMode: "grid",
		muiTableBodyProps: {
			sx: { overflow: "auto" },
		},
		renderDetailPanel: ({ row }) => {
			const roomType = row.original.roomType;
			return (
				<Box
					sx={{
						display: "flex",
						gap: 3,
						flexWrap: "wrap",
					}}
				>
					<Box flex={1} minWidth={200}>
						<Typography variant="caption" color="text.secondary" gutterBottom>
							Type Name
						</Typography>
						<Typography variant="body2" fontWeight={600}>
							{roomType.typeName}
						</Typography>
					</Box>

					<Box flex={1} minWidth={150}>
						<Typography variant="caption" color="text.secondary" gutterBottom>
							Price
						</Typography>
						<Typography variant="body2" fontWeight={600}>
							${roomType.price}
						</Typography>
					</Box>

					<Box flex={1} minWidth={150}>
						<Typography variant="caption" color="text.secondary" gutterBottom>
							Capacity
						</Typography>
						<Typography variant="body2" fontWeight={600}>
							{roomType.capacity} {roomType.capacity === 1 ? "guest" : "guests"}
						</Typography>
					</Box>

					{roomType.bedTypes && roomType.bedTypes.length > 0 && (
						<Box flex={1} minWidth={150}>
							<Typography variant="caption" color="text.secondary" gutterBottom>
								Bed Configuration
							</Typography>
							<Box display="flex" gap={1} flexWrap="wrap" mt={0.5}>
								{roomType.bedTypes.map((bt) => (
									<Chip
										key={bt.id}
										label={`${bt.numBed}x ${bt.bedType.bedTypeName}`}
										size="small"
										variant="outlined"
									/>
								))}
							</Box>
						</Box>
					)}
					{roomType.amenities && roomType.amenities.length > 0 && (
						<Box flex={1} minWidth={200}>
							<Typography variant="caption" color="text.secondary" gutterBottom>
								Amenities
							</Typography>
							<Box display="flex" gap={0.5} flexWrap="wrap" mt={0.5}>
								{roomType.amenities.map((amenity) => (
									<Chip
										key={amenity.id}
										label={amenity.amenityName}
										size="small"
										color="primary"
										variant="outlined"
									/>
								))}
							</Box>
						</Box>
					)}
				</Box>
			);
		},
		positionActionsColumn: "last",
		enableColumnResizing: true,
	});

	if (!checkInDate || !checkOutDate) {
		return (
			<Box sx={{ p: 3, textAlign: "center" }}>
				<Typography color="text.secondary">
					{t("booking.selectDatesFirst")}
				</Typography>
			</Box>
		);
	}

	return (
		<Box>
			<MaterialReactTable table={table} />
		</Box>
	);
};
