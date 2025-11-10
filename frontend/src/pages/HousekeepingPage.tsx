import { Chip, Stack } from "@mui/material";
import { useAtomValue } from "jotai";
import type { MRT_ColumnDef } from "material-react-table";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import HousekeepingInfo from "../components/housekeeping/HousekeepingInfo";
import HousekeepingRowActions from "../components/housekeeping/HousekeepingRowActions";
import ShowMyTasksButton from "../components/housekeeping/ShowMyTasksButton";
import UploadNewHousekeepingButton from "../components/housekeeping/UploadNewHousekeepingButton";
import { HousekeepingPriority, HousekeepingStatus } from "../interfaces/enums";
import type { HousekeepingData } from "../interfaces/housekeeping";
import type { UserData } from "../interfaces/user";
import DataTable from "../lib/DataTable";
import {
	housekeepingInfoDrawerAtom,
	LoadableHousekeepingAtom,
} from "../state/housekeeping";
import { DATE_FORMAT, dateToString } from "../utils/dateUtils";
import {
	getHousekeepingPriorityColor,
	getHousekeepingStatusColor,
} from "../utils/statusUtils";

function HousekeepingPage() {
	const loadValue = useAtomValue(LoadableHousekeepingAtom);
	const { t } = useTranslation();

	const columns = useMemo<MRT_ColumnDef<HousekeepingData>[]>(
		() => [
			{
				accessorKey: "id",
				header: t("housekeeping.housekeepingId"),
				filterVariant: "text",
				filterFn: "equals",
			},
			{
				accessorKey: "userId",
				header: t("housekeeping.userId"),
				accessorFn: (row) => row.user?.id ?? t("housekeeping.unassigned"),
			},
			{
				accessorKey: "room.roomNumber",
				header: t("housekeeping.room"),
				accessorFn: (row) => {
					return `${row.room.building.name} ${row.room.roomNumber}`;
				},
			},
			{
				accessorKey: "user",
				header: t("housekeeping.assignedTo"),
				accessorFn: (row) =>
					row.user
						? `${row.user.firstName} ${row.user.lastName}`
						: t("housekeeping.unassigned"),
			},
			{
				accessorKey: "status",
				header: t("housekeeping.status"),
				Cell: ({ cell }) => {
					const status = cell.getValue<string>();
					return (
						<Chip
							label={t(`enums.housekeepingStatus.${status}`)}
							color={getHousekeepingStatusColor(status)}
							size="small"
						/>
					);
				},
				filterVariant: "multi-select",
				filterSelectOptions: Object.values(HousekeepingStatus).map(
					(status) => ({
						label: t(`enums.housekeepingStatus.${status}`),
						value: status,
					}),
				),
			},
			{
				accessorKey: "priority",
				header: t("housekeeping.priority"),
				Cell: ({ cell }) => {
					const priority = cell.getValue<string>();
					return (
						<Chip
							label={t(`enums.housekeepingPriority.${priority}`)}
							color={getHousekeepingPriorityColor(priority)}
							size="small"
						/>
					);
				},
				filterVariant: "multi-select",
				filterSelectOptions: Object.values(HousekeepingPriority).map(
					(priority) => ({
						label: t(`enums.housekeepingPriority.${priority}`),
						value: priority,
					}),
				),
			},
			{
				accessorKey: "note",
				header: t("housekeeping.note"),
			},
			{
				accessorKey: "assignedDate",
				header: t("housekeeping.assignedDate"),
				Cell: ({ cell }) => {
					const value = cell.getValue<Date | undefined>();
					return value ? dateToString(value, DATE_FORMAT) : "";
				},
			},
			{
				accessorKey: "completionDate",
				header: t("housekeeping.completionDate"),
				Cell: ({ cell }) => {
					const value = cell.getValue<Date | undefined>();
					return value ? dateToString(value, DATE_FORMAT) : "";
				},
			},
			{
				accessorKey: "createdAt",
				header: t("housekeeping.createdAt"),
				Cell: ({ cell }) => dateToString(cell.getValue<Date>()),
			},
			{
				accessorKey: "updatedAt",
				header: t("housekeeping.updatedAt"),
				Cell: ({ cell }) => {
					const value = cell.getValue<Date | undefined>();
					return value ? dateToString(value) : "";
				},
			},
		],
		[t],
	);

	const [filteredUser, setFilteredUser] = useState<UserData | null>(null);

	const columnFilters = useMemo(() => {
		if (!filteredUser) return [];
		return [{ id: "userId", value: filteredUser.id }];
	}, [filteredUser]);

	return (
		<DataTable
			columns={columns}
			data={loadValue.state === "hasData" ? loadValue.data : []}
			isLoading={loadValue.state === "loading"}
			renderTopToolbarCustomActions={() => (
				<Stack direction="row" spacing={2}>
					<UploadNewHousekeepingButton />
					<ShowMyTasksButton onFilterChange={setFilteredUser} />
				</Stack>
			)}
			enableRowActions={true}
			enableColumnFilters={true}
			drawerAtom={housekeepingInfoDrawerAtom}
			drawerContent={<HousekeepingInfo />}
			renderRowActionMenuItems={({ row, table, closeMenu }) => {
				const myElement = (
					<HousekeepingRowActions
						row={row}
						table={table}
						closeMenu={closeMenu}
					/>
				);
				const reactNodeArray = React.Children.toArray([myElement]);
				return reactNodeArray;
			}}
			defaultHiddenColumns={["createdAt", "updatedAt", "userId"]}
			tableOptions={{
				enableFilters: true,
				state: {
					columnFilters,
				},
				initialState: {
					density: "compact",
					showColumnFilters: true,
				},
			}}
		/>
	);
}

export default HousekeepingPage;
