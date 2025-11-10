import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import {
	errorCodeTranslationKeyAtom,
	errorMessageTranslationKeyAtom,
	errorSeverityAtom,
} from "../state/operationState";

export const ErrorAlert = () => {
	const { t } = useTranslation();
	const [errorMessage, setErrorMessage] = useAtom(
		errorMessageTranslationKeyAtom,
	);
	const [errorCode, setErrorCode] = useAtom(errorCodeTranslationKeyAtom);
	const [severity, setSeverity] = useAtom(errorSeverityAtom);

	if (!errorMessage) {
		return undefined;
	}

	return (
		<Snackbar
			open={true}
			autoHideDuration={10000}
			onClose={() => {
				setErrorMessage(undefined);
				setErrorCode(undefined);
				setSeverity("error");
			}}
			anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
		>
			<Alert severity={severity} variant="filled">
				{errorMessage && t(errorMessage)}
				{errorMessage && errorCode && ": "}
				{errorCode && t(errorCode)}
			</Alert>
		</Snackbar>
	);
};
