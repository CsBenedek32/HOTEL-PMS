import { useAtomValue } from "jotai";
import type { MRT_ColumnDef } from "material-react-table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import AmenityInfo from "../components/amenity/AmenityInfo";
import AmenityRowActions from "../components/amenity/AmenityRowActions";
import UploadNewAmenityBtn from "../components/amenity/UploadNewAmenityButton";
import type { AmenityData } from "../interfaces/amenity";
import DataTable from "../lib/DataTable";
import { amenityInfoDrawerAtom, LoadableAmenityAtom } from "../state/amenity";
import { dateToString } from "../utils/dateUtils";

function AmenityPage() {
	const loadValue = useAtomValue(LoadableAmenityAtom);
	const { t } = useTranslation();

	const columns = useMemo<MRT_ColumnDef<AmenityData>[]>(
		() => [
			{
				accessorKey: "amenityName",
				header: `${t("amenity.amenityName")}`,
				maxSize: 30,
			},
			{
				accessorKey: "createdAt",
				header: `${t("amenity.createdAt")}`,
				Cell: ({ cell }) => dateToString(cell.getValue<Date>()),
				maxSize: 20,
			},
			{
				accessorKey: "updatedAt",
				header: `${t("amenity.updatedAt")}`,
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
			renderTopToolbarCustomActions={() => <UploadNewAmenityBtn />}
			enableRowActions={true}
			renderRowActionMenuItems={({ row, table, closeMenu }) => {
				const myElement = (
					<AmenityRowActions row={row} table={table} closeMenu={closeMenu} />
				);
				const reactNodeArray = React.Children.toArray([myElement]);
				return reactNodeArray;
			}}
			drawerAtom={amenityInfoDrawerAtom}
			drawerContent={<AmenityInfo />}
		/>
	);
}

export default AmenityPage;
