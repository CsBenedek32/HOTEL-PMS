import { Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { selectedServiceAtom } from "../../state/service";

const ServiceInfo = () => {
	const selectedService = useAtomValue(selectedServiceAtom);

	return <Box component="pre">{JSON.stringify(selectedService, null, 2)}</Box>;
};

export default ServiceInfo;
