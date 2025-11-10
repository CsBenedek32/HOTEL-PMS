import { Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { selectedRoleAtom } from "../../state/role";

const RoleInfo = () => {
	const selectedRole = useAtomValue(selectedRoleAtom);

	return <Box component="pre">{JSON.stringify(selectedRole, null, 2)}</Box>;
};

export default RoleInfo;
