import { useAtomValue } from "jotai";
import type { MRT_ColumnDef } from "material-react-table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import RoleInfo from "../components/role/RoleInfo";
import RoleRowActions from "../components/role/RoleRowActions";
import UploadNewRoleBtn from "../components/role/UploadNewRoleButton";
import type { RoleData } from "../interfaces/role";
import DataTable from "../lib/DataTable";
import { LoadableRoleAtom, roleInfoDrawerAtom } from "../state/role";
import { dateToString } from "../utils/dateUtils";

function RolePage() {
	const loadValue = useAtomValue(LoadableRoleAtom);
	const { t } = useTranslation();

	const columns = useMemo<MRT_ColumnDef<RoleData>[]>(
		() => [
			{
				accessorKey: "name",
				header: `${t("role.name")}`,
				maxSize: 30,
			},
			{
				accessorKey: "active",
				header: `${t("role.active")}`,
				Cell: ({ cell }) =>
					cell.getValue() ? t("common.yes") : t("common.no"),
				maxSize: 15,
			},
			{
				accessorKey: "createdAt",
				header: `${t("role.createdAt")}`,
				Cell: ({ cell }) => dateToString(cell.getValue<Date>()),
				maxSize: 20,
			},
			{
				accessorKey: "updatedAt",
				header: `${t("role.updatedAt")}`,
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
			renderTopToolbarCustomActions={() => <UploadNewRoleBtn />}
			enableRowActions={true}
			drawerAtom={roleInfoDrawerAtom}
			drawerContent={<RoleInfo />}
			renderRowActionMenuItems={({ row, table, closeMenu }) => {
				const myElement = (
					<RoleRowActions row={row} table={table} closeMenu={closeMenu} />
				);
				const reactNodeArray = React.Children.toArray([myElement]);
				return reactNodeArray;
			}}
		/>
	);
}

export default RolePage;
