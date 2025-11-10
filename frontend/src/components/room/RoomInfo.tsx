import { Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { selectedRoomAtom } from "../../state/room";

const RoomInfo = () => {
	const selectedRoom = useAtomValue(selectedRoomAtom);

	return <Box component="pre">{JSON.stringify(selectedRoom, null, 2)}</Box>;
};

export default RoomInfo;
