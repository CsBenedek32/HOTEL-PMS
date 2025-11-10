import { Card, CardContent, type SxProps, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface StatisticsCardProps {
	title: string;
	children: ReactNode;
	sx?: SxProps;
}

export const StatisticsCard = ({
	title,
	children,
	sx,
}: StatisticsCardProps) => {
	return (
		<Card sx={{ height: "100%", ...sx, boxShadow: 3, borderRadius: 5 }}>
			<CardContent>
				<Typography variant="h6" gutterBottom>
					{title}
				</Typography>
				{children}
			</CardContent>
		</Card>
	);
};
