import { Lock } from "@mui/icons-material";
import type { ButtonProps } from "@mui/material";
import { Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import type * as React from "react";
import { hasPermission } from "../utils/permissions";

interface Props extends ButtonProps {
	label: string | React.ReactNode;
	color?:
		| "inherit"
		| "primary"
		| "secondary"
		| "success"
		| "error"
		| "info"
		| "warning";
	variant?: "text" | "outlined" | "contained";
	onClick?: (e?: React.MouseEvent) => void;
	onMouseDown?: (e?: React.MouseEvent) => void;
	disabled?: boolean;
	size?: "small" | "medium" | "large";
	className?: string;
	startIcon?: React.ReactNode;
	requiredPermissions?: string[];
	title?: string;
}

export const ButtonUI = ({ requiredPermissions, ...props }: Props) => {
	const hasPermissionForBtn = requiredPermissions
		? hasPermission(requiredPermissions ? requiredPermissions : [])
		: true;
	const disabled = hasPermissionForBtn ? props.disabled : true;
	const startIcon = hasPermissionForBtn ? (
		props.startIcon
	) : (
		<Lock style={{ marginRight: 5 }} />
	);

	const button = (
		<Button
			{...props}
			onClick={disabled ? () => {} : props.onClick}
			disabled={disabled}
			size={props.size || "small"}
			startIcon={startIcon}
		>
			{props.label}
		</Button>
	);

	if (props.title) {
		return (
			<Tooltip title={props.title}>
				<span>{button}</span>
			</Tooltip>
		);
	}

	return button;
};

export default ButtonUI;
