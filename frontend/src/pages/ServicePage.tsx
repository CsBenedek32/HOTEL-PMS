import { useAtomValue } from "jotai";
import type { MRT_ColumnDef } from "material-react-table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import ServiceInfo from "../components/service/ServiceInfo";
import ServiceRowActions from "../components/service/ServiceRowActions";
import UploadNewServiceBtn from "../components/service/UploadNewServiceButton";
import type { ServiceData } from "../interfaces/service";
import DataTable from "../lib/DataTable";
import { LoadableServiceAtom, serviceInfoDrawerAtom } from "../state/service";
import { dateToString } from "../utils/dateUtils";

function ServicePage() {
	const loadValue = useAtomValue(LoadableServiceAtom);

	const { t } = useTranslation();

	const columns = useMemo<MRT_ColumnDef<ServiceData>[]>(
		() => [
			{
				accessorKey: "name",
				header: `${t("service.name")}`,
			},
			{
				accessorKey: "description",
				header: `${t("service.description")}`,
			},
			{
				accessorKey: "cost",
				header: `${t("service.cost")}`,
				Cell: ({ cell }) => {
					const cost = cell.getValue<number | undefined>();
					return cost !== undefined ? `$${cost.toFixed(2)}` : "—";
				},
			},
			{
				accessorKey: "vat.name",
				header: `${t("service.vat")}`,
				Cell: ({ row }) => {
					const vat = row.original.vat;
					return vat ? `${vat.name} (${vat.percentage}%)` : "—";
				},
			},
			{
				accessorKey: "createdAt",
				header: `${t("service.createdAt")}`,
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
				header: `${t("service.updatedAt")}`,
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
			renderTopToolbarCustomActions={() => <UploadNewServiceBtn />}
			enableRowActions={true}
			enableColumnFilters={true}
			drawerAtom={serviceInfoDrawerAtom}
			drawerContent={<ServiceInfo />}
			renderRowActionMenuItems={({ row, table, closeMenu }) => {
				const myElement = (
					<ServiceRowActions row={row} table={table} closeMenu={closeMenu} />
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

export default ServicePage;
