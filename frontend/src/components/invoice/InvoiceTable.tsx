import { Chip } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import type { MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { InvoiceData } from "../../interfaces/invoice";
import DataTable from "../../lib/DataTable";
import {
	LoadableInvoiceAtom,
	selectedInvoiceIdAtom,
} from "../../state/invoice";
import { dateToString } from "../../utils/dateUtils";
import { getPaymentStatusColor } from "../../utils/statusUtils";
import { getZebraStripingSx } from "../../utils/tableUtils";
import UploadNewInvoiceBtn from "./UploadNewInvoiceButton";

function InvoiceTable() {
	const loadValue = useAtomValue(LoadableInvoiceAtom);
	const { t } = useTranslation();
	const setSelectedInvoiceId = useSetAtom(selectedInvoiceIdAtom);

	const columns = useMemo<MRT_ColumnDef<InvoiceData>[]>(
		() => [
			{
				accessorKey: "name",
				header: `${t("invoice.name")}`,
			},
			{
				accessorKey: "active",
				header: `${t("invoice.active")}`,
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
					{ value: true, label: t("common.yes") },
					{ value: false, label: t("common.no") },
				],
			},
			{
				accessorKey: "paymentStatus",
				header: `${t("invoice.paymentStatus")}`,
				Cell: ({ cell }) => {
					const status = cell.getValue<string>();
					return (
						<Chip
							label={t(`enums.paymentStatus.${status}`)}
							color={getPaymentStatusColor(status)}
							size="small"
						/>
					);
				},
			},
			{
				accessorKey: "totalSum",
				header: `${t("invoice.totalSum")}`,
				Cell: ({ cell }) => {
					const total = cell.getValue<number | undefined>();
					return total !== undefined ? `$${total.toFixed(2)}` : "—";
				},
			},
			{
				accessorKey: "recipientName",
				header: `${t("invoice.recipientName")}`,
			},
			{
				accessorKey: "recipientCompanyName",
				header: `${t("invoice.recipientCompanyName")}`,
			},
			{
				accessorKey: "recipientEmail",
				header: `${t("invoice.recipientEmail")}`,
			},
			{
				accessorKey: "description",
				header: `${t("invoice.description")}`,
			},
			{
				accessorKey: "createdAt",
				header: `${t("invoice.createdAt")}`,
				Cell: ({ cell }) => dateToString(cell.getValue<Date>()),
			},
			{
				accessorKey: "updatedAt",
				header: `${t("invoice.updatedAt")}`,
				Cell: ({ cell }) => {
					const value = cell.getValue<Date | undefined>();
					return value ? dateToString(value) : "";
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
			renderTopToolbarCustomActions={() => <UploadNewInvoiceBtn />}
			enableRowActions={false}
			enableColumnFilters={true}
			defaultHiddenColumns={[
				"createdAt",
				"updatedAt",
				"recipientCompanyName",
				"active",
				"description",
				"recipientName",
				"totalSum",
				"recipientEmail",
			]}
			tableOptions={{
				enableFilters: true,
				initialState: {
					density: "compact",
					showColumnFilters: true,
					columnFilters: [{ id: "active", value: true }],
				},
				muiTableBodyRowProps: ({ row }) => ({
					onClick: () => {
						setSelectedInvoiceId(row.original.id);
					},
					sx: getZebraStripingSx(row.index, {
						cursor: "pointer",
						"&:hover": {
							backgroundColor: "action.hover",
						},
					}),
				}),
			}}
		/>
	);
}

export default InvoiceTable;
