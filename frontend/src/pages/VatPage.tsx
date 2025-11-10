import { useAtomValue } from "jotai";
import type { MRT_ColumnDef } from "material-react-table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import UploadNewVatBtn from "../components/vat/UploadNewVatButton";
import VatInfo from "../components/vat/VatInfo";
import VatRowActions from "../components/vat/VatRowActions";
import type { VatData } from "../interfaces/vat";
import DataTable from "../lib/DataTable";
import { LoadableVatAtom, vatInfoDrawerAtom } from "../state/vat";

function VatPage() {
	const loadValue = useAtomValue(LoadableVatAtom);
	const { t } = useTranslation();

	const columns = useMemo<MRT_ColumnDef<VatData>[]>(
		() => [
			{
				accessorKey: "name",
				header: `${t("vat.name")}`,
			},
			{
				accessorKey: "percentage",
				header: `${t("vat.percentage")}`,
				Cell: ({ cell }) => `${cell.getValue<number>()}%`,
			},
		],
		[t],
	);

	return (
		<DataTable
			columns={columns}
			data={loadValue.state === "hasData" ? loadValue.data : []}
			isLoading={loadValue.state === "loading"}
			renderTopToolbarCustomActions={() => <UploadNewVatBtn />}
			enableRowActions={true}
			renderRowActionMenuItems={({ row, table, closeMenu }) => {
				const myElement = (
					<VatRowActions row={row} table={table} closeMenu={closeMenu} />
				);
				const reactNodeArray = React.Children.toArray([myElement]);
				return reactNodeArray;
			}}
			drawerAtom={vatInfoDrawerAtom}
			drawerContent={<VatInfo />}
		/>
	);
}

export default VatPage;
