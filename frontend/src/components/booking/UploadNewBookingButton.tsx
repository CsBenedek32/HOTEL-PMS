import { Upload } from "@mui/icons-material";
import { useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import ButtonUI from "../../lib/ButtonUi";
import { bookingModalOpenAtom } from "../../state/multiStepBookingModal";

const UploadNewBookingBtn = () => {
	const { t } = useTranslation();
	const setBookingModalOpen = useSetAtom(bookingModalOpenAtom);

	const handleClick = () => {
		setBookingModalOpen(true);
	};

	return (
		<ButtonUI
			color="primary"
			startIcon={<Upload />}
			label={t("booking.upload")}
			onClick={handleClick}
			requiredPermissions={["Admin", "Receptionist"]}
			variant="contained"
		/>
	);
};

export default UploadNewBookingBtn;
