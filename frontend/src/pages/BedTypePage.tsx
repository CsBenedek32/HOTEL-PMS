import { useAtomValue } from "jotai";
import type { MRT_ColumnDef } from "material-react-table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import BedTypeInfo from "../components/bedType/BedTypeInfo";
import BedTypeRowActions from "../components/bedType/BedTypeRowActions";
import UploadNewBedTypeBtn from "../components/bedType/UploadNewBedTypeButton";
import type { BedTypeData } from "../interfaces/bedType";
import DataTable from "../lib/DataTable";
import { bedTypeInfoDrawerAtom, LoadableBedTypeAtom } from "../state/bedType";
import { dateToString } from "../utils/dateUtils";

function BedTypePage() {
	const loadValue = useAtomValue(LoadableBedTypeAtom);
	const { t } = useTranslation();

	const columns = useMemo<MRT_ColumnDef<BedTypeData>[]>(
		() => [
			{
				accessorKey: "bedTypeName",
				header: `${t("bedType.bedTypeName")}`,
				maxSize: 30,
			},
			{
				accessorKey: "createdAt",
				header: `${t("bedType.createdAt")}`,
				Cell: ({ cell }) => dateToString(cell.getValue<Date>()),
				maxSize: 20,
			},
			{
				accessorKey: "updatedAt",
				header: `${t("bedType.updatedAt")}`,
				Cell: ({ cell }) => {
					const value = cell.getValue<Date | undefined>();
					return value ? dateToString(value) : "";
				},
				maxSize: 20,
			},
		],
		[t],
	);

	return (
		<DataTable
			columns={columns}
			data={loadValue.state === "hasData" ? loadValue.data : []}
			isLoading={loadValue.state === "loading"}
			renderTopToolbarCustomActions={() => <UploadNewBedTypeBtn />}
			enableRowActions={true}
			renderRowActionMenuItems={({ row, table, closeMenu }) => {
				const myElement = (
					<BedTypeRowActions row={row} table={table} closeMenu={closeMenu} />
				);
				const reactNodeArray = React.Children.toArray([myElement]);
				return reactNodeArray;
			}}
			drawerAtom={bedTypeInfoDrawerAtom}
			drawerContent={<BedTypeInfo />}
		/>
	);
}

export default BedTypePage;
