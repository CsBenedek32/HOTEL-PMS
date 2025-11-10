import { Chip } from "@mui/material";
import { useAtomValue } from "jotai";
import type { MRT_ColumnDef } from "material-react-table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import UploadNewUserBtn from "../components/user/UploadNewUserButton";
import UserInfo from "../components/user/UserInfo";
import UserRowActions from "../components/user/UserRowActions";
import type { UserData } from "../interfaces/user";
import DataTable from "../lib/DataTable";
import { LoadableUserAtom, userInfoDrawerAtom } from "../state/user";
import { dateToString } from "../utils/dateUtils";

function UserPage() {
	const loadValue = useAtomValue(LoadableUserAtom);
	const { t } = useTranslation();

	const columns = useMemo<MRT_ColumnDef<UserData>[]>(
		() => [
			{
				accessorKey: "firstName",
				header: `${t("user.firstName")}`,
				maxSize: 20,
			},
			{
				accessorKey: "lastName",
				header: `${t("user.lastName")}`,
				maxSize: 20,
			},
			{
				accessorKey: "email",
				header: `${t("user.email")}`,
				maxSize: 30,
			},
			{
				accessorKey: "phone",
				header: `${t("user.phone")}`,
				maxSize: 20,
			},
			{
				accessorKey: "roles",
				header: `${t("user.roles")}`,
				Cell: ({ cell }) => {
					const roles = cell.getValue<UserData["roles"]>();
					return roles?.map((role) => role.name).join(", ") || "";
				},
				maxSize: 30,
			},
			{
				accessorKey: "active",
				header: `${t("user.active")}`,
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
				maxSize: 15,
			},
			{
				accessorKey: "createdAt",
				header: `${t("user.createdAt")}`,
				Cell: ({ cell }) => dateToString(cell.getValue<Date>()),
				maxSize: 20,
			},
			{
				accessorKey: "updatedAt",
				header: `${t("user.updatedAt")}`,
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
			renderTopToolbarCustomActions={() => <UploadNewUserBtn />}
			enableRowActions={true}
			enableColumnFilters={true}
			drawerAtom={userInfoDrawerAtom}
			drawerContent={<UserInfo />}
			renderRowActionMenuItems={({ row, table, closeMenu }) => {
				const myElement = (
					<UserRowActions row={row} table={table} closeMenu={closeMenu} />
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

export default UserPage;
