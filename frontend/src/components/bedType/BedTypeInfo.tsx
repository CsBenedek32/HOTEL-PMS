import { Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { selectedBedTypeAtom } from "../../state/bedType";

const BedTypeInfo = () => {
	const selectedBedType = useAtomValue(selectedBedTypeAtom);

	return <Box component="pre">{JSON.stringify(selectedBedType, null, 2)}</Box>;
};

export default BedTypeInfo;
