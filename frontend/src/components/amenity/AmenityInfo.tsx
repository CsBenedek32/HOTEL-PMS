import { Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { selectedAmenityAtom } from "../../state/amenity";

const AmenityInfo = () => {
	const selectedAmenity = useAtomValue(selectedAmenityAtom);

	return <Box component="pre">{JSON.stringify(selectedAmenity, null, 2)}</Box>;
};

export default AmenityInfo;
