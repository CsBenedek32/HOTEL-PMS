import { Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { selectedUserAtom } from "../../state/user";

const UserInfo = () => {
	const selectedUser = useAtomValue(selectedUserAtom);

	return <Box component="pre">{JSON.stringify(selectedUser, null, 2)}</Box>;
};

export default UserInfo;
