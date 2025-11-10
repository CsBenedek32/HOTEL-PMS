import { createTheme } from "@mui/material/styles";

export const colors = {
	primary: "#d97757",
	background: "#424b54",
	textPrimary: "#FFFFFF",
	textSecondary: "#C2C0B1",
	secondary: "#a390e4",
};

export const colors2 = {
	primary: "#d97757",
	background: "#f5f5f5",
	textPrimary: "#1a1a1a",
	textSecondary: "#666666",
	secondary: "#a390e4",
};

export const darkTheme = createTheme({
	typography: {
		fontFamily: "'Cooper BT', sans-serif",
		fontSize: 17,
	},
	palette: {
		mode: "dark",
		primary: {
			main: colors.primary,
		},
		secondary: {
			main: colors.secondary,
		},
		background: {
			default: colors.background,
			paper: "#3d3d3d",
		},
		text: {
			primary: colors.textPrimary,
			secondary: colors.textSecondary,
		},
	},
	components: {
		MuiTableCell: {
			styleOverrides: {
				head: {
					color: colors.textSecondary,
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
				},
			},
		},
		MuiDialog: {
			styleOverrides: {
				paper: {
					backgroundImage: "none",
				},
			},
		},
		MuiAlert: {
			styleOverrides: {
				filledSuccess: {
					color: "#ffffff",
				},
				filledError: {
					color: "#ffffff",
				},
				filledWarning: {
					color: "#ffffff",
				},
				filledInfo: {
					color: "#ffffff",
				},
			},
		},
	},
});
