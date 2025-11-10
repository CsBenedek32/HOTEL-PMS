import { Chip } from "@mui/material";
import { useAtomValue } from "jotai";
import type { MRT_ColumnDef } from "material-react-table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import BuildingInfo from "../components/building/BuildingInfo";
import BuildingRowActions from "../components/building/BuildingRowActions";
import UploadNewBuildingBtn from "../components/building/UploadNewBuildingButton";
import type { BuildingData } from "../interfaces/building";
import DataTable from "../lib/DataTable";
import {
	buildingInfoDrawerAtom,
	LoadableBuildingAtom,
} from "../state/building";
import { dateToString } from "../utils/dateUtils";

function BuildingPage() {
	const loadValue = useAtomValue(LoadableBuildingAtom);

	const { t } = useTranslation();

	const columns = useMemo<MRT_ColumnDef<BuildingData>[]>(
		() => [
			{
				accessorKey: "name",
				header: `${t("building.name")}`,
			},
			{
				accessorKey: "address",
				header: `${t("building.address")}`,
			},
			{
				accessorKey: "city",
				header: `${t("building.city")}`,
			},
			{
				accessorKey: "zipcode",
				header: `${t("building.zipcode")}`,
			},
			{
				accessorKey: "country",
				header: `${t("building.country")}`,
			},
			{
				accessorKey: "phoneNumber",
				header: `${t("building.phoneNumber")}`,
			},
			{
				accessorKey: "email",
				header: `${t("building.email")}`,
			},
			{
				accessorKey: "active",
				header: `${t("building.active")}`,
				Cell: ({ cell }) => {
					const isActive = cell.getValue<boolean>();
					return (
						<Chip
							label={isActive ? t("common.yes") : t("common.no")}
							color={isActive ? "success" : "default"}
							size="small"
						/>
					);
				},

				filterVariant: "select",
				filterSelectOptions: [
					{ label: t("common.yes"), value: "true" },
					{ label: t("common.no"), value: "false" },
				],
				filterFn: (row, id, filterValue) => {
					if (!filterValue) return true;
					const isActive = row.getValue<boolean>(id);
					return filterValue === "true" ? isActive : !isActive;
				},
			},
			{
				accessorKey: "createdAt",
				header: `${t("building.createdAt")}`,
				Cell: ({ cell }) => dateToString(cell.getValue<Date>()),

				filterVariant: "date",
				filterFn: (row, id, filterValue) => {
					if (!filterValue) return true;
					const date = row.getValue<Date>(id);
					return date >= new Date(filterValue);
				},
			},
			{
				accessorKey: "updatedAt",
				header: `${t("building.updatedAt")}`,
				Cell: ({ cell }) => {
					const value = cell.getValue<Date | undefined>();
					return value ? dateToString(value) : "";
				},

				filterVariant: "date",
				filterFn: (row, id, filterValue) => {
					if (!filterValue) return true;
					const date = row.getValue<Date | undefined>(id);
					if (!date) return false;
					return date >= new Date(filterValue);
				},
			},
		],
		[t],
	);

	return (
		<DataTable
			columns={columns}
			data={loadValue.state === "hasData" ? loadValue.data : []}
			isLoading={loadValue.state === "loading"}
			renderTopToolbarCustomActions={() => <UploadNewBuildingBtn />}
			enableRowActions={true}
			enableColumnFilters={true}
			drawerAtom={buildingInfoDrawerAtom}
			drawerContent={<BuildingInfo />}
			renderRowActionMenuItems={({ row, table, closeMenu }) => {
				const myElement = (
					<BuildingRowActions row={row} table={table} closeMenu={closeMenu} />
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
				},
				muiFilterDatePickerProps: {
					format: "yyyy.MM.dd",
				},
			}}
		/>
	);
}

export default BuildingPage;
