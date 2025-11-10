import type { SxProps, Theme } from "@mui/material";

export const getZebraStripingColor = (rowIndex: number): string => {
	return rowIndex % 2 === 0 ? "rgba(0, 0, 0, 0.02)" : "inherit";
};

export const getZebraStripingSx = (
	rowIndex: number,
	additionalSx?: SxProps<Theme>,
): SxProps<Theme> => {
	return {
		backgroundColor: getZebraStripingColor(rowIndex),
		...additionalSx,
	};
};
