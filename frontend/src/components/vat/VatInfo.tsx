import { Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { selectedVatAtom } from "../../state/vat";

const VatInfo = () => {
	const selectedVat = useAtomValue(selectedVatAtom);

	return <Box component="pre">{JSON.stringify(selectedVat, null, 2)}</Box>;
};

export default VatInfo;
