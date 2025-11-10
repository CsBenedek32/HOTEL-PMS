import { Box } from "@mui/material";
import type { PrimitiveAtom } from "jotai";
import type { MRT_RowData, MRT_TableOptions } from "material-react-table";
import {
	MaterialReactTable,
	useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { MRT_Localization_HU } from "material-react-table/locales/hu";
import type React from "react";
import { useTranslation } from "react-i18next";
import { getZebraStripingSx } from "../utils/tableUtils";
import AtomDrawer from "./AtomDrawer";
import ConfirmModal from "./ConfirmModal";
import { FormModal } from "./form";

interface DataTableProps<TData extends MRT_RowData> {
	columns: MRT_TableOptions<TData>["columns"];
	data: TData[];
	isLoading?: boolean;
	renderTopToolbarCustomActions?: () => React.ReactNode;
	renderRowActionMenuItems?: MRT_TableOptions<TData>["renderRowActionMenuItems"];
	enableRowActions?: boolean;
	enableColumnFilters?: boolean;
	drawerAtom?: PrimitiveAtom<boolean>;
	drawerContent?: React.ReactNode;
	tableOptions?: Partial<MRT_TableOptions<TData>>;
	defaultHiddenColumns?: string[];
}

function DataTable<TData extends MRT_RowData>({
	columns,
	data,
	isLoading = false,
	renderTopToolbarCustomActions,
	renderRowActionMenuItems,
	enableRowActions = false,
	enableColumnFilters = true,
	drawerAtom,
	drawerContent,
	tableOptions = {},
	defaultHiddenColumns = [],
}: DataTableProps<TData>) {
	const { i18n } = useTranslation();
	const localization =
		i18n.language === "hu" ? MRT_Localization_HU : MRT_Localization_EN;

	const table = useMaterialReactTable<TData>({
		columns,
		data,
		state: isLoading ? { isLoading: true } : {},
		enableFullScreenToggle: true,
		enableStickyHeader: true,
		layoutMode: "grid",
		enableDensityToggle: true,
		enableColumnFilters,
		localization,
		muiTableBodyProps: {
			sx: { overflow: "auto" },
		},
		muiTableBodyRowProps: ({ row }) => ({
			sx: getZebraStripingSx(row.index),
		}),
		muiTablePaperProps: {
			sx: {
				display: "flex",
				flexDirection: "column",
				height: "100%",
			},
		},
		muiTableContainerProps: {
			sx: { flexGrow: 1 },
		},
		muiBottomToolbarProps: {
			sx: { marginTop: "auto" },
		},

		renderTopToolbarCustomActions,
		enableRowActions,
		enableGlobalFilter: false,
		positionActionsColumn: "last",
		renderRowActionMenuItems,

		enableColumnResizing: true,
		...tableOptions,
		initialState: {
			density: "compact",
			columnVisibility: Object.fromEntries(
				defaultHiddenColumns.map((col) => [col, false]),
			),
			...tableOptions.initialState,
		},
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
				<ConfirmModal />
				<FormModal />
				{drawerAtom && drawerContent && (
					<AtomDrawer toggleDrawerAtom={drawerAtom} anchor="right">
						{drawerContent}
					</AtomDrawer>
				)}
			</Box>
		</Box>
	);
}

export default DataTable;
