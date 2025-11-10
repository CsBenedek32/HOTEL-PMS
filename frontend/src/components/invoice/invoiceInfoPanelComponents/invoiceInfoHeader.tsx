import { Delete, Print, Receipt } from "@mui/icons-material";
import { Chip, IconButton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { deleteInvoice, exportInvoiceToPdf } from "../../../api/invoiceApi";
import type { InvoiceData } from "../../../interfaces/invoice";
import { reloadTimestampAtom } from "../../../state/common";
import {
	confirmModalCallbackAtom,
	confirmModalOpenAtom,
	confirmModalQuestionAtom,
} from "../../../state/confirmModal";
import { dateToString } from "../../../utils/dateUtils";
import { downloadBlob } from "../../../utils/fileUtils";
import {
	getActiveStatusColor,
	getPaymentStatusColor,
} from "../../../utils/statusUtils";

interface InvoiceInfoHeaderProps {
	selectedInvoice: InvoiceData;
}

const InvoiceInfoHeader = ({ selectedInvoice }: InvoiceInfoHeaderProps) => {
	const { t } = useTranslation();
	const setConfirmModalOpen = useSetAtom(confirmModalOpenAtom);
	const setConfirmModalQuestion = useSetAtom(confirmModalQuestionAtom);
	const setConfirmModalCallback = useSetAtom(confirmModalCallbackAtom);
	const reloadTimeStamp = useSetAtom(reloadTimestampAtom);

	const handlePrintInvoice = async () => {
		const pdfBlob = await exportInvoiceToPdf(selectedInvoice.id);
		if (pdfBlob) {
			downloadBlob(pdfBlob, `${selectedInvoice.name}.pdf`);
		}
	};

	const handleDeleteInvoice = () => {
		setConfirmModalQuestion(
			`${t("common.confirmDelete")} "${selectedInvoice.name}"?`,
		);
		setConfirmModalCallback(() => async () => {
			await deleteInvoice(selectedInvoice.id);
			reloadTimeStamp(Date.now());
		});
		setConfirmModalOpen(true);
	};

	return (
		<Box display="flex" justifyContent="space-between" alignItems="center">
			<Box>
				<Box display="flex" alignItems="center" gap={2} mb={1}>
					<Receipt fontSize="large" color="primary" />
					<Typography variant="h4" fontWeight={600}>
						{selectedInvoice.name}
					</Typography>
				</Box>
				<Box display="flex" gap={1} alignItems="center">
					<Chip
						label={selectedInvoice.paymentStatus}
						color={getPaymentStatusColor(selectedInvoice?.paymentStatus)}
						size="small"
					/>
					<Chip
						label={
							selectedInvoice.active ? t("common.active") : t("common.inactive")
						}
						color={getActiveStatusColor(selectedInvoice?.active)}
						size="small"
					/>
					<Typography variant="caption" color="text.secondary">
						{t("common.created")} {dateToString(selectedInvoice.createdAt)}
					</Typography>
				</Box>
			</Box>
			<Box display="flex" gap={1}>
				<IconButton color="primary" onClick={handlePrintInvoice}>
					<Print />
				</IconButton>
				<IconButton color="error" onClick={handleDeleteInvoice}>
					<Delete />
				</IconButton>
			</Box>
		</Box>
	);
};

export default InvoiceInfoHeader;
