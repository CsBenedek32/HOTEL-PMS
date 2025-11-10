import { Box, Divider, Stack, Typography } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { reloadTimestampAtom } from "../../state/common";
import { LoadableInvoiceAtomById } from "../../state/invoice";
import InvoiceBookings from "./invoiceInfoPanelComponents/InvoiceBookings";
import InvoiceInfoDetails from "./invoiceInfoPanelComponents/InvoiceInfoDetails";
import InvoiceInfoHeader from "./invoiceInfoPanelComponents/invoiceInfoHeader";
import ServicesTable from "./ServicesTable";

function InvoiceInfoPanel() {
	const { t } = useTranslation();
	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);
	const selectedInvoice = useAtomValue(LoadableInvoiceAtomById);

	const handleUpdate = () => {
		setReloadTimestamp(Date.now());
	};

	if (selectedInvoice.state !== "hasData" || selectedInvoice.data === null) {
		return (
			<Box sx={{ height: "100%", padding: 2, overflow: "auto" }}>
				<Typography
					sx={{
						flex: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						height: "100%",
					}}
				>
					{t("invoice.selectInvoice")}
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ height: "100%", padding: 2, overflow: "auto" }}>
			<Stack spacing={3}>
				<InvoiceInfoHeader selectedInvoice={selectedInvoice.data} />
				<Divider />
				<InvoiceInfoDetails
					selectedInvoice={selectedInvoice.data}
					onUpdate={handleUpdate}
				/>
				<Divider />
				<Box>
					<ServicesTable
						data={selectedInvoice.data.serviceModels}
						disabled={false}
						totalWithVat={selectedInvoice.data.totalSum}
					/>
				</Box>
				<Divider />
				<InvoiceBookings bookings={selectedInvoice.data.bookings} />
			</Stack>
		</Box>
	);
}

export default InvoiceInfoPanel;
