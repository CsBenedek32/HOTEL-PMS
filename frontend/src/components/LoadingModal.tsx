import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { loadingModalAtom, loadingModalMessageAtom } from "../state/loading";

export const LoadingModal = () => {
	const open = useAtomValue(loadingModalAtom);
	const message = useAtomValue(loadingModalMessageAtom);

	return (
		<Backdrop
			sx={{
				color: "#fff",
				zIndex: (theme) => theme.zIndex.modal + 1,
				backdropFilter: "blur(4px)",
			}}
			open={open}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 2,
				}}
			>
				<CircularProgress color="inherit" size={60} />
				<Typography variant="h6" component="div">
					{message}
				</Typography>
			</Box>
		</Backdrop>
	);
};
