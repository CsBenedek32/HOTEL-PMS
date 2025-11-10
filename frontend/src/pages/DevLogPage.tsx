import { Box } from "@mui/material";
import { useAtomValue } from "jotai";
import {
	MaterialReactTable,
	type MRT_ColumnDef,
	useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { MRT_Localization_HU } from "material-react-table/locales/hu";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { DevLogData } from "../interfaces/devLog";
import { LoadableDevLogAtom } from "../state/devLog";
import { dateToString } from "../utils/dateUtils";

function DevLogPage() {
	const loadValue = useAtomValue(LoadableDevLogAtom);
	const { t, i18n } = useTranslation();
	const localization =
		i18n.language === "hu" ? MRT_Localization_HU : MRT_Localization_EN;

	const columns = useMemo<MRT_ColumnDef<DevLogData>[]>(
		() => [
			{
				accessorKey: "id",
				header: `${t("devLog.devLogId")}`,
				maxSize: 15,
			},
			{
				accessorKey: "version",
				header: `${t("devLog.version")}`,
				maxSize: 20,
			},
			{
				accessorKey: "description",
				header: `${t("devLog.description")}`,
				Cell: ({ cell }) => (
					<Box
						sx={{
							maxWidth: "500px",
							whiteSpace: "pre-wrap",
							wordBreak: "break-word",
						}}
					>
						{cell.getValue<string>()}
					</Box>
				),
			},
			{
				accessorKey: "createdAt",
				header: `${t("devLog.createdAt")}`,
				Cell: ({ cell }) => dateToString(cell.getValue<Date>()),
				maxSize: 20,
			},
			{
				accessorKey: "updatedAt",
				header: `${t("devLog.updatedAt")}`,
				Cell: ({ cell }) => {
					const value = cell.getValue<Date | undefined>();
					return value ? dateToString(value) : "";
				},
				maxSize: 20,
			},
		],
		[t],
	);

	const table = useMaterialReactTable({
		columns,
		data: loadValue.state === "hasData" ? loadValue.data : [],
		localization,
		enableFullScreenToggle: true,
		enableStickyHeader: true,
		layoutMode: "semantic",
		enableColumnResizing: false,
		enableDensityToggle: true,
		initialState: { density: "compact" },
		muiTableBodyProps: {
			sx: { overflow: "auto" },
		},
		muiBottomToolbarProps: {
			sx: { position: "absolute", bottom: 0 },
		},
		enableRowActions: false,
		enableGlobalFilter: true,
	});

	return (
		<Box sx={{ height: "100vh", display: "flex" }}>
			<Box
				sx={{
					flexGrow: 1,
					overflow: "hidden",
				}}
			>
				<MaterialReactTable table={table} />
			</Box>
		</Box>
	);
}

export default DevLogPage;
