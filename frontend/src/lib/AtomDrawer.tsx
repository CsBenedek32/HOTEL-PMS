import { Drawer } from "@mui/material";
import { useAtom } from "jotai";
import type { PrimitiveAtom } from "jotai/vanilla/atom";

export interface AtomDrawerProps {
	toggleDrawerAtom: PrimitiveAtom<boolean>;
	anchor?: "left" | "right" | "top" | "bottom";
	children?: React.ReactNode;
}

const AtomDrawer = ({
	toggleDrawerAtom,
	anchor = "right",
	children,
}: AtomDrawerProps) => {
	const [toggleDrawer, setToggleDrawer] = useAtom(toggleDrawerAtom);

	return (
		<Drawer
			anchor={anchor}
			open={toggleDrawer}
			onClose={() => setToggleDrawer(false)}
			slotProps={{
				paper: { sx: { width: "50%", height: "100%", padding: 2 } },
			}}
		>
			{children}
		</Drawer>
	);
};

export default AtomDrawer;
