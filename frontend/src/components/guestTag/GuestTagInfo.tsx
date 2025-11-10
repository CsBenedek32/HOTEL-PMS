import { Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { selectedGuestTagAtom } from "../../state/guestTag";

const GuestTagInfo = () => {
	const selectedGuestTag = useAtomValue(selectedGuestTagAtom);

	return <Box component="pre">{JSON.stringify(selectedGuestTag, null, 2)}</Box>;
};

export default GuestTagInfo;
