import { Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { selectedRoomTypeAtom } from "../../state/roomType";

const RoomTypeInfo = () => {
	const selectedRoomType = useAtomValue(selectedRoomTypeAtom);

	return <Box component="pre">{JSON.stringify(selectedRoomType, null, 2)}</Box>;
};

export default RoomTypeInfo;
