import type { SvgIconComponent } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

interface IconButtonUiProps {
	icon: SvgIconComponent;
	onClick: () => void;
	color?:
		| "primary"
		| "secondary"
		| "success"
		| "error"
		| "info"
		| "warning"
		| "inherit";
	variant?: "text" | "contained";
	tooltip?: string;
	disabled?: boolean;
	size?: "small" | "medium" | "large";
}

const IconButtonUi = ({
	icon: Icon,
	onClick,
	color = "primary",
	variant = "text",
	tooltip,
	disabled = false,
	size = "medium",
}: IconButtonUiProps) => {
	const button = (
		<IconButton
			onClick={onClick}
			disabled={disabled}
			color={color}
			size={size}
			sx={{
				borderRadius: "50%",
				...(variant === "contained" && {
					backgroundColor: `${color}.main`,
					color: "white",
					"&:hover": {
						backgroundColor: `${color}.dark`,
					},
				}),
			}}
		>
			<Icon />
		</IconButton>
	);

	if (tooltip) {
		return <Tooltip title={tooltip}>{button}</Tooltip>;
	}

	return button;
};

export default IconButtonUi;
