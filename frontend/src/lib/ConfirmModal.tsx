import { Box, Button, Stack, Typography } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import {
	confirmModalButtonTextAtom,
	confirmModalCallbackAtom,
	confirmModalColorAtom,
	confirmModalOpenAtom,
	confirmModalQuestionAtom,
} from "../state/confirmModal";
import AtomModal from "./AtomModal";

const ConfirmModal = () => {
	const { t } = useTranslation();
	const [, setOpen] = useAtom(confirmModalOpenAtom);
	const [callback, setCallback] = useAtom(confirmModalCallbackAtom);
	const [color, setColor] = useAtom(confirmModalColorAtom);
	const [buttonText, setButtonText] = useAtom(confirmModalButtonTextAtom);
	const question = useAtomValue(confirmModalQuestionAtom);

	const handleConfirm = () => {
		if (callback) {
			callback();
		}
		setOpen(false);
		setCallback(undefined);
		setColor("primary");
		setButtonText("common.confirm");
	};

	const handleCancel = () => {
		setOpen(false);
	};

	return (
		<AtomModal atom={confirmModalOpenAtom}>
			<Box sx={{ padding: 3, justifyContent: "center", display: "flex" }}>
				<Stack>
					<Typography variant="h6" sx={{ marginBottom: 4 }}>
						{t(question)}
					</Typography>

					<Stack
						direction="row"
						spacing={2}
						sx={{ width: "100%", justifyContent: "space-between" }}
					>
						<Button
							onClick={handleCancel}
							color="secondary"
							variant="contained"
							sx={{ minWidth: 120 }}
						>
							{t("common.cancel")}
						</Button>
						<Button
							onClick={handleConfirm}
							color={color}
							variant="contained"
							sx={{ minWidth: 120 }}
						>
							{t(buttonText)}
						</Button>
					</Stack>
				</Stack>
			</Box>
		</AtomModal>
	);
};

export default ConfirmModal;
