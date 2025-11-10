import { useAtomValue } from "jotai";
import type { MRT_ColumnDef } from "material-react-table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import RoomTypeInfo from "../components/roomType/RoomTypeInfo";
import RoomTypeRowActions from "../components/roomType/RoomTypeRowActions";
import UploadNewRoomTypeBtn from "../components/roomType/UploadNewRoomTypeButton";
import type { RoomTypeData } from "../interfaces/roomType";
import DataTable from "../lib/DataTable";
import { roomTypeFilterAtom } from "../state/filterState";
import {
	LoadableRoomTypeAtom,
	roomTypeInfoDrawerAtom,
} from "../state/roomType";
import { dateToString } from "../utils/dateUtils";

function RoomTypePage() {
	const loadValue = useAtomValue(LoadableRoomTypeAtom);
	const roomTypeFilter = useAtomValue(roomTypeFilterAtom);
	const { t } = useTranslation();

	const columns = useMemo<MRT_ColumnDef<RoomTypeData>[]>(
		() => [
			{
				accessorKey: "id",
				header: `${t("roomType.id")}`,
				filterVariant: "text",
				filterFn: "equals",
				maxSize: 10,
			},
			{
				accessorKey: "typeName",
				header: `${t("roomType.typeName")}`,
			},
			{
				accessorKey: "price",
				header: `${t("roomType.price")}`,
				Cell: ({ cell }) => `$${cell.getValue<number>().toFixed(2)}`,
			},
			{
				accessorKey: "capacity",
				header: `${t("roomType.capacity")}`,
				size: 100,
			},
			{
				accessorKey: "bedTypes",
				header: `${t("roomType.bedTypes")}`,
				accessorFn: (row) => {
					return (
						row.bedTypes
							?.map((bt) => `${bt.numBed}x ${bt.bedType.bedTypeName}`)
							.join(", ") || ""
					);
				},
				Cell: ({ cell }) => cell.getValue<string>(),
			},
			{
				accessorKey: "amenities",
				header: `${t("roomType.amenities")}`,
				accessorFn: (row) => {
					return row.amenities?.map((a) => a.amenityName).join(", ") || "";
				},
				Cell: ({ cell }) => cell.getValue<string>(),
			},
			{
				accessorKey: "createdAt",
				header: `${t("roomType.createdAt")}`,
				Cell: ({ cell }) => dateToString(cell.getValue<Date>()),
			},
			{
				accessorKey: "updatedAt",
				header: `${t("roomType.updatedAt")}`,
				Cell: ({ cell }) => {
					const value = cell.getValue<Date | undefined>();
					return value ? dateToString(value) : "";
				},
			},
		],
		[t],
	);

	const initialColumnFilters = useMemo(() => {
		if (!roomTypeFilter) return [];

		const filters = [];
		if (roomTypeFilter.roomTypeId !== undefined) {
			filters.push({ id: "id", value: roomTypeFilter.roomTypeId });
		}

		return filters;
	}, [roomTypeFilter]);

	return (
		<DataTable
			columns={columns}
			data={loadValue.state === "hasData" ? loadValue.data : []}
			isLoading={loadValue.state === "loading"}
			renderTopToolbarCustomActions={() => <UploadNewRoomTypeBtn />}
			enableRowActions={true}
			enableColumnFilters={true}
			renderRowActionMenuItems={({ row, table, closeMenu }) => {
				const myElement = (
					<RoomTypeRowActions row={row} table={table} closeMenu={closeMenu} />
				);
				const reactNodeArray = React.Children.toArray([myElement]);
				return reactNodeArray;
			}}
			drawerAtom={roomTypeInfoDrawerAtom}
			drawerContent={<RoomTypeInfo />}
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

export default RoomTypePage;
