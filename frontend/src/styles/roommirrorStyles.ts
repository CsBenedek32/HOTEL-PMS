import type { Theme } from "@mui/material";

export const getTimelineContainerStyles = (theme: Theme) => ({
	"& .rct-horizontal-lines .rct-hl-even, & .rct-horizontal-lines .rct-hl-odd": {
		bgcolor: "background.paper",
		borderBottom: `1px solid ${theme.palette.divider}`,
	},
	"& .rct-vertical-lines .rct-vl": {
		borderLeft: `1px solid ${theme.palette.divider}`,
	},
	"& .rct-vertical-lines .rct-vl.rct-day-6, & .rct-vertical-lines .rct-vl.rct-day-0":
		{
			bgcolor: theme.palette.action.hover,
		},
	"& .rct-cursor-line": {
		bgcolor: theme.palette.primary.main,
	},
});
