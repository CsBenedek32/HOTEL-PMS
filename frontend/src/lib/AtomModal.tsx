import { Dialog } from "@mui/material";
import type { PrimitiveAtom } from "jotai";
import { useAtom } from "jotai";
import type { ReactNode } from "react";

interface AtomModalProps {
	atom: PrimitiveAtom<boolean>;
	children: ReactNode;
}

const AtomModal = ({ atom, children }: AtomModalProps) => {
	const [open, setOpen] = useAtom(atom);

	return (
		<Dialog
			open={open}
			onClose={() => setOpen(false)}
			maxWidth="sm"
			fullWidth
			slotProps={{
				paper: {
					sx: {
						borderRadius: 3,
					},
				},
			}}
		>
			{children}
		</Dialog>
	);
};

export default AtomModal;
