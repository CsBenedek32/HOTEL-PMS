import { Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { selectedGuestAtom } from "../../state/guest";

const GuestInfo = () => {
	const selectedGuest = useAtomValue(selectedGuestAtom);

	return <Box component="pre">{JSON.stringify(selectedGuest, null, 2)}</Box>;
};

export default GuestInfo;
