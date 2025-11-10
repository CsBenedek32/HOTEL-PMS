import { Chip } from "@mui/material";
import { useAtomValue } from "jotai";
import type { MRT_ColumnDef } from "material-react-table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import GuestTagInfo from "../components/guestTag/GuestTagInfo";
import GuestTagRowActions from "../components/guestTag/GuestTagRowActions";
import UploadNewGuestTagBtn from "../components/guestTag/UploadNewGuestTagButton";
import type { GuestTagData } from "../interfaces/guestTag";
import DataTable from "../lib/DataTable";
import {
	guestTagInfoDrawerAtom,
	LoadableGuestTagAtom,
} from "../state/guestTag";
import { dateToString } from "../utils/dateUtils";

function GuestTagPage() {
	const loadValue = useAtomValue(LoadableGuestTagAtom);

	const { t } = useTranslation();

	const columns = useMemo<MRT_ColumnDef<GuestTagData>[]>(
		() => [
			{
				accessorKey: "tagName",
				header: `${t("guestTag.tagName")}`,
			},
			{
				accessorKey: "active",
				header: `${t("guestTag.active")}`,
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
				header: `${t("guestTag.createdAt")}`,
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
				header: `${t("guestTag.updatedAt")}`,
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
			renderTopToolbarCustomActions={() => <UploadNewGuestTagBtn />}
			enableRowActions={true}
			enableColumnFilters={true}
			drawerAtom={guestTagInfoDrawerAtom}
			drawerContent={<GuestTagInfo />}
			renderRowActionMenuItems={({ row, table, closeMenu }) => {
				const myElement = (
					<GuestTagRowActions row={row} table={table} closeMenu={closeMenu} />
				);
				const reactNodeArray = React.Children.toArray([myElement]);
				return reactNodeArray;
			}}
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

export default GuestTagPage;
