import { Chip } from "@mui/material";
import { useAtomValue } from "jotai";
import type { MRT_ColumnDef } from "material-react-table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import RoomInfo from "../components/room/RoomInfo";
import RoomRowActions from "../components/room/RoomRowActions";
import UploadNewRoomBtn from "../components/room/UploadNewRoomButton";
import { RoomStatus } from "../interfaces/enums";
import type { RoomData } from "../interfaces/room";
import DataTable from "../lib/DataTable";
import { roomFilterAtom } from "../state/filterState";
import { LoadableRoomAtom, roomInfoDrawerAtom } from "../state/room";
import { dateToString } from "../utils/dateUtils";
import { getRoomStatusColor } from "../utils/statusUtils";

function RoomPage() {
	const loadValue = useAtomValue(LoadableRoomAtom);
	const roomFilter = useAtomValue(roomFilterAtom);
	const { t } = useTranslation();

	const columns = useMemo<MRT_ColumnDef<RoomData>[]>(
		() => [
			{
				accessorKey: "id",
				header: `${t("room.roomId")}`,
				maxSize: 10,
				filterVariant: "text",
				filterFn: "equals",
			},
			{
				accessorKey: "roomNumber",
				header: `${t("room.roomNumber")}`,
				maxSize: 20,
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
				maxSize: 20,
			},
			{
				accessorKey: "floorNumber",
				header: `${t("room.floorNumber")}`,
				maxSize: 15,
			},
			{
				accessorKey: "building.name",
				header: `${t("room.building")}`,
				accessorFn: (row) => row.building.name,
				maxSize: 25,
			},
			{
				accessorKey: "roomType.typeName",
				header: `${t("room.roomType")}`,
				accessorFn: (row) => row.roomType.typeName,
				maxSize: 25,
			},
			{
				accessorKey: "description",
				header: `${t("room.description")}`,
				maxSize: 40,
			},
			{
				accessorKey: "createdAt",
				header: `${t("room.createdAt")}`,
				Cell: ({ cell }) => dateToString(cell.getValue<Date>()),
				maxSize: 20,
			},
			{
				accessorKey: "updatedAt",
				header: `${t("room.updatedAt")}`,
				Cell: ({ cell }) => {
					const value = cell.getValue<Date | undefined>();
					return value ? dateToString(value) : "";
				},
				maxSize: 20,
			},
		],
		[t],
	);

	const initialColumnFilters = useMemo(() => {
		if (!roomFilter) return [];

		const filters = [];
		if (roomFilter.roomId !== undefined) {
			filters.push({ id: "id", value: roomFilter.roomId });
		}
		if (roomFilter.roomNumber) {
			filters.push({ id: "roomNumber", value: roomFilter.roomNumber });
		}
		if (roomFilter.buildingId !== undefined) {
			filters.push({ id: "building.name", value: roomFilter.buildingId });
		}
		if (roomFilter.floorNumber !== undefined) {
			filters.push({ id: "floorNumber", value: roomFilter.floorNumber });
		}
		if (roomFilter.status) {
			filters.push({ id: "status", value: roomFilter.status });
		}

		return filters;
	}, [roomFilter]);

	return (
		<DataTable
			columns={columns}
			data={loadValue.state === "hasData" ? loadValue.data : []}
			isLoading={loadValue.state === "loading"}
			renderTopToolbarCustomActions={() => <UploadNewRoomBtn />}
			enableRowActions={true}
			enableColumnFilters={true}
			drawerAtom={roomInfoDrawerAtom}
			drawerContent={<RoomInfo />}
			renderRowActionMenuItems={({ row, table, closeMenu }) => {
				const myElement = (
					<RoomRowActions row={row} table={table} closeMenu={closeMenu} />
				);
				const reactNodeArray = React.Children.toArray([myElement]);
				return reactNodeArray;
			}}
			defaultHiddenColumns={["createdAt", "updatedAt"]}
			tableOptions={{
				enableFilters: true,
				initialState: {
					density: "compact",
					showColumnFilters: true,
					columnFilters: initialColumnFilters,
				},
			}}
		/>
	);
}

export default RoomPage;
