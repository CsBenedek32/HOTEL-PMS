import { Add, BuildCircle, Delete } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import {
	MaterialReactTable,
	type MRT_ColumnDef,
	type MRT_Row,
	type MRT_TableOptions,
	useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { MRT_Localization_HU } from "material-react-table/locales/hu";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { updateInvoiceServices } from "../../api/invoiceApi";
import type { ServiceData } from "../../interfaces/service";
import { reloadTimestampAtom } from "../../state/common";
import {
	confirmModalButtonTextAtom,
	confirmModalCallbackAtom,
	confirmModalColorAtom,
	confirmModalOpenAtom,
	confirmModalQuestionAtom,
} from "../../state/confirmModal";
import { selectedInvoiceIdAtom } from "../../state/invoice";
import { LoadableServiceAtom } from "../../state/service";
import { getZebraStripingSx } from "../../utils/tableUtils";
import { InfoSection } from "../common/InfoDrawerComponents";

interface ServicesTableProps {
	data: ServiceData[];
	disabled?: boolean;
	totalWithVat?: number;
}

function ServicesTable({ data, disabled, totalWithVat }: ServicesTableProps) {
	const { t, i18n } = useTranslation();
	const localization =
		i18n.language === "hu" ? MRT_Localization_HU : MRT_Localization_EN;
	const loadServices = useAtomValue(LoadableServiceAtom);
	const invoiceId = useAtomValue(selectedInvoiceIdAtom);
	const [selectedService, setSelectedService] = useState<ServiceData | null>(
		null,
	);

	const totalWithoutVat = useMemo(() => {
		return data.reduce((sum, service) => sum + (service.cost || 0), 0);
	}, [data]);

	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);
	const setConfirmOpen = useSetAtom(confirmModalOpenAtom);
	const setConfirmQuestion = useSetAtom(confirmModalQuestionAtom);
	const setConfirmCallback = useSetAtom(confirmModalCallbackAtom);
	const setConfirmColor = useSetAtom(confirmModalColorAtom);
	const setConfirmButtonText = useSetAtom(confirmModalButtonTextAtom);

	const availableServices = useMemo(() => {
		if (loadServices.state !== "hasData") return [];
		const addedServiceIds = data.map((s) => s.id);

		return loadServices.data.filter(
			(x) => x.immutable !== true && !addedServiceIds.includes(x.id),
		);
	}, [loadServices, data]);

	const columns = useMemo<MRT_ColumnDef<ServiceData>[]>(
		() => [
			{
				accessorKey: "name",
				header: `${t("service.name")}`,
				editVariant: "select",
				editSelectOptions:
					availableServices.length > 0
						? availableServices.map((x) => x.name)
						: [],
				muiEditTextFieldProps: ({ row, table }) => {
					const isCreating = table.getState().creatingRow?.id === row.id;
					return {
						select: true,
						value: isCreating
							? selectedService?.name || ""
							: row.original.name || "",
						onChange: (e) => {
							const selectedName = e.target.value;
							const selectedService = availableServices.find(
								(s) => s.name === selectedName,
							);

							if (selectedService) {
								setSelectedService(selectedService);
							}
						},
					};
				},
			},
			{
				accessorKey: "description",
				header: `${t("service.description")}`,
				muiEditTextFieldProps: () => ({
					disabled: true,
					value: selectedService?.description || "",
				}),
				Cell: ({ cell }) => {
					const value = cell.getValue<string | undefined>();
					return value || "—";
				},
			},
			{
				accessorKey: "cost",
				header: `${t("service.cost")}`,
				aggregationFn: "sum",
				muiEditTextFieldProps: () => ({
					disabled: true,
					value: selectedService?.cost || 0,
				}),
				Cell: ({ cell }) => {
					const cost = cell.getValue<number | undefined>();
					return cost !== undefined ? `$${cost.toFixed(2)}` : "—";
				},
				AggregatedCell: ({ cell }) => {
					const total = cell.getValue<number>();
					return `Total: $${total.toFixed(2)}`;
				},
				Footer: () => {
					return (
						<Box sx={{ fontWeight: "bold" }}>
							{t("invoice.totalWithoutVat")}: ${totalWithoutVat.toFixed(2)}
						</Box>
					);
				},
			},
			{
				accessorKey: "vat.name",
				header: `${t("service.vat")}`,
				muiEditTextFieldProps: () => ({
					disabled: true,
					value: selectedService
						? `${selectedService?.vat?.name} (${selectedService?.vat?.percentage}%)`
						: "",
				}),
				Cell: ({ row }) => {
					const vat = row.original.vat;
					return vat ? `${vat.name} (${vat.percentage}%)` : "—";
				},
				Footer: () => {
					return totalWithVat !== null && totalWithVat !== undefined ? (
						<Box sx={{ fontWeight: "bold" }}>
							{t("invoice.totalWithVat")}: ${totalWithVat.toFixed(2)}
						</Box>
					) : null;
				},
			},
		],
		[t, availableServices, selectedService, totalWithoutVat, totalWithVat],
	);

	const handleAddService: MRT_TableOptions<ServiceData>["onCreatingRowSave"] =
		async () => {
			if (!selectedService || !invoiceId) {
				table.setCreatingRow(null);
				return;
			}

			try {
				const newServices = [...data.map((x) => x.id), selectedService.id];
				await updateInvoiceServices(invoiceId, newServices);
				setReloadTimestamp(Date.now());
				setSelectedService(null);
			} catch (error) {
				console.log("Failed to add service:", error);
			}
			table.setCreatingRow(null);
		};

	const handleCancelAddService: MRT_TableOptions<ServiceData>["onCreatingRowCancel"] =
		async () => {
			setSelectedService(null);
		};

	const handleRemoveService = (row: MRT_Row<ServiceData>) => {
		const removeService = data
			.filter((x) => x.id !== row.original.id)
			.map((x) => x.id);

		setConfirmQuestion(t("service.deleteFromInvoiceConfirm"));
		setConfirmButtonText(t("common.delete"));
		setConfirmColor("error");
		setConfirmCallback(() => async () => {
			try {
				if (invoiceId) {
					await updateInvoiceServices(invoiceId, removeService);
					setReloadTimestamp(Date.now());
				}
			} catch (error) {
				console.log("Failed to remove service:", error);
			}
		});
		setConfirmOpen(true);
	};

	const table = useMaterialReactTable({
		columns,
		data: data,
		localization,
		enableFullScreenToggle: false,
		enableStickyHeader: true,
		layoutMode: "semantic",
		enableColumnResizing: true,
		enableDensityToggle: false,
		enableEditing: !disabled,
		createDisplayMode: "row",
		positionCreatingRow: "bottom",
		displayColumnDefOptions: {
			"mrt-row-actions": {
				header: `${t("common.actions")}`,
				size: 80,
			},
		},
		positionActionsColumn: "last",
		initialState: { density: "compact" },
		muiTableBodyProps: {
			sx: {
				overflow: "auto",
				backgroundColor: disabled ? "action.disabledBackground" : "inherit",
			},
		},
		muiTableProps: {
			sx: {
				tableLayout: "fixed",
			},
		},
		muiTableBodyRowProps: ({ row }) => ({
			sx: getZebraStripingSx(row.index),
		}),
		renderRowActions: ({ row }) =>
			!disabled && row.original.virtual !== true ? (
				<Tooltip title={t("common.delete")}>
					<IconButton
						onClick={() => {
							handleRemoveService(row);
						}}
						color="error"
					>
						<Delete />
					</IconButton>
				</Tooltip>
			) : null,
		renderTopToolbarCustomActions: ({ table }) =>
			!disabled ? (
				<Tooltip title={t("invoice.addService")}>
					<span>
						<IconButton
							color="primary"
							disabled={invoiceId === null || availableServices.length === 0}
							onClick={() => {
								table.setCreatingRow(true);
							}}
						>
							<Add />
						</IconButton>
					</span>
				</Tooltip>
			) : null,
		onCreatingRowSave: handleAddService,
		onCreatingRowCancel: handleCancelAddService,
	});

	return (
		<InfoSection
			title={t("invoice.services")}
			icon={<BuildCircle color="primary" />}
		>
			<MaterialReactTable table={table} />
		</InfoSection>
	);
}

export default ServicesTable;
