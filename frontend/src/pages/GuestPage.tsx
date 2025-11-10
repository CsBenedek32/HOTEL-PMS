import { Chip } from "@mui/material";
import { useAtomValue } from "jotai";
import type { MRT_ColumnDef } from "material-react-table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import GuestInfo from "../components/guest/GuestInfo";
import GuestRowActions from "../components/guest/GuestRowActions";
import UploadNewGuestBtn from "../components/guest/UploadNewGuestButton";
import type { GuestData } from "../interfaces/guest";
import DataTable from "../lib/DataTable";
import { guestFilterAtom } from "../state/filterState";
import { guestInfoDrawerAtom, LoadableGuestAtom } from "../state/guest";
import { LoadableGuestTagAtom } from "../state/guestTag";
import { dateToString } from "../utils/dateUtils";

function GuestPage() {
	const loadValue = useAtomValue(LoadableGuestAtom);
	const guestFilter = useAtomValue(guestFilterAtom);
	const loadableGuestTags = useAtomValue(LoadableGuestTagAtom);

	const { t } = useTranslation();

	const columns = useMemo<MRT_ColumnDef<GuestData>[]>(
		() => [
			{
				accessorKey: "id",
				header: `${t("guest.id")}`,
			},
			{
				accessorKey: "firstName",
				header: `${t("guest.firstName")}`,
			},
			{
				accessorKey: "lastName",
				header: `${t("guest.lastName")}`,
			},
			{
				accessorKey: "email",
				header: `${t("guest.email")}`,
			},
			{
				accessorKey: "phoneNumber",
				header: `${t("guest.phoneNumber")}`,
			},
			{
				accessorKey: "homeCountry",
				header: `${t("guest.homeCountry")}`,
			},
			{
				accessorKey: "type",
				header: `${t("guest.type")}`,
				Cell: ({ cell }) => {
					const type = cell.getValue<string>();
					return (
						<Chip
							label={t(`enums.guestType.${type}`)}
							color={type === "ADULT" ? "primary" : "default"}
							size="small"
						/>
					);
				},
				filterVariant: "select",
				filterSelectOptions: [
					{ label: t("enums.guestType.ADULT"), value: "ADULT" },
					{ label: t("enums.guestType.CHILD"), value: "CHILD" },
				],
			},
			{
				accessorKey: "guestTags",
				header: `${t("guest.guestTags")}`,
				accessorFn: (row) => {
					return row.guestTags?.map((tag) => tag.tagName).join(", ") || "";
				},
				Cell: ({ cell }) => cell.getValue<string>(),
				filterVariant: "multi-select",
				filterSelectOptions:
					loadableGuestTags.state === "hasData"
						? loadableGuestTags.data
								.filter((tag) => tag.active !== false)
								.map((tag) => ({
									label: tag.tagName,
									value: tag.tagName,
								}))
						: [],
				filterFn: (row, _id, filterValue) => {
					if (!filterValue || filterValue.length === 0) return true;
					const guestTags =
						row.original.guestTags?.map((tag) => tag.tagName) || [];

					return filterValue.some((selectedTag: string) =>
						guestTags.includes(selectedTag),
					);
				},
			},
			{
				accessorKey: "active",
				header: `${t("guest.active")}`,
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
				header: `${t("guest.createdAt")}`,
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
				header: `${t("guest.updatedAt")}`,
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
		[t, loadableGuestTags],
	);

	const initialColumnFilters = useMemo(() => {
		if (!guestFilter) return [];

		const filters = [];
		if (guestFilter.guestId !== undefined) {
			filters.push({ id: "id", value: guestFilter.guestId });
		}
		return filters;
	}, [guestFilter]);

	return (
		<DataTable
			columns={columns}
			data={loadValue.state === "hasData" ? loadValue.data : []}
			isLoading={loadValue.state === "loading"}
			renderTopToolbarCustomActions={() => <UploadNewGuestBtn />}
			enableRowActions={true}
			enableColumnFilters={true}
			drawerAtom={guestInfoDrawerAtom}
			drawerContent={<GuestInfo />}
			renderRowActionMenuItems={({ row, table, closeMenu }) => {
				const myElement = (
					<GuestRowActions row={row} table={table} closeMenu={closeMenu} />
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
				muiFilterDatePickerProps: {
					format: "yyyy.MM.dd",
				},
			}}
		/>
	);
}

export default GuestPage;
