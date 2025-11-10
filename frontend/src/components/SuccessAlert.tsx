import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import {
	successCodeTranslationKeyAtom,
	successMessageTranslationKeyAtom,
	successSeverityAtom,
} from "../state/operationState";

export const SuccessAlert = () => {
	const { t } = useTranslation();
	const [successMessage, setSuccessMessage] = useAtom(
		successMessageTranslationKeyAtom,
	);
	const [successCode, setSuccessCode] = useAtom(successCodeTranslationKeyAtom);
	const [severity, setSeverity] = useAtom(successSeverityAtom);

	if (!successMessage && !successCode) {
		return undefined;
	}

	return (
		<Snackbar
			open={true}
			autoHideDuration={6000}
			onClose={() => {
				setSuccessMessage(undefined);
				setSuccessCode(undefined);
				setSeverity("success");
			}}
			anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
		>
			<Alert severity={severity} variant="filled">
				{successMessage && t(successMessage)}
				{successMessage && successCode && ": "}
				{successCode && t(successCode)}
			</Alert>
		</Snackbar>
	);
};
