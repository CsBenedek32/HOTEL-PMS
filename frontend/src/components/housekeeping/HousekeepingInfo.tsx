import { Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { selectedHousekeepingAtom } from "../../state/housekeeping";

const HousekeepingInfo = () => {
	const selectedHousekeeping = useAtomValue(selectedHousekeepingAtom);

	return (
		<Box component="pre">{JSON.stringify(selectedHousekeeping, null, 2)}</Box>
	);
};

export default HousekeepingInfo;
