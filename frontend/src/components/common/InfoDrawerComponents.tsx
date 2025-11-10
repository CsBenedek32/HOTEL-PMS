import {
	Box,
	Card,
	CardContent,
	Grid,
	type SxProps,
	type Theme,
	Typography,
} from "@mui/material";
import type React from "react";

interface InfoItemProps {
	icon?: React.ReactNode;
	label: string;
	value: string | number | undefined;
}

export const InfoItem = ({ icon, label, value }: InfoItemProps) => (
	<Box display="flex" alignItems="center" gap={1.5} mb={2}>
		{icon && (
			<Box color="primary.main" display="flex" alignItems="center">
				{icon}
			</Box>
		)}
		<Box flex={1}>
			<Typography variant="caption" color="text.secondary" display="block">
				{label}
			</Typography>
			<Typography variant="body1" fontWeight={500}>
				{value ?? "—"}
			</Typography>
		</Box>
	</Box>
);

interface InfoSectionProps {
	title: string;
	icon?: React.ReactNode;
	headerAction?: React.ReactNode;
	children: React.ReactNode;
	sx?: SxProps<Theme>;
}

export const InfoSection = ({
	title,
	icon,
	headerAction,
	children,
	sx,
}: InfoSectionProps) => (
	<Card variant="outlined" sx={sx}>
		<CardContent>
			<Box display="flex" alignItems="center" gap={1.5} mb={2}>
				{icon && <Box color="primary">{icon}</Box>}
				<Typography variant="h6" fontWeight={600}>
					{title}
				</Typography>
				{headerAction && <Box ml="auto">{headerAction}</Box>}
			</Box>
			{children}
		</CardContent>
	</Card>
);

interface MetadataField {
	label: string;
	value: string | number | undefined;
	monospace?: boolean;
	hide?: boolean;
}

interface MetadataSectionProps {
	fields: MetadataField[];
}

export const MetadataSection = ({ fields }: MetadataSectionProps) => (
	<InfoSection title="Metadata">
		<Grid container spacing={2}>
			{fields
				.filter((field) => !field.hide)
				.map((field, index) => (
					<Grid
						size={{ xs: 12, sm: 6 }}
						key={`metadata-field-${field.label}-${index}`}
					>
						<Typography variant="caption" color="text.secondary">
							{field.label}
						</Typography>
						<Typography
							variant="body2"
							fontFamily={field.monospace ? "monospace" : undefined}
						>
							{field.value ?? "—"}
						</Typography>
					</Grid>
				))}
		</Grid>
	</InfoSection>
);

interface DetailsSectionProps {
	title: string;
	icon?: React.ReactNode;
	details: {
		icon?: React.ReactNode;
		label: string;
		value: string | number | undefined;
	}[];
}

export const DetailsSection = ({
	title,
	icon,
	details,
}: DetailsSectionProps) => (
	<InfoSection title={title} icon={icon}>
		<Grid container spacing={2}>
			{details.map((detail, index) => (
				<Grid
					size={{ xs: 12, sm: 6 }}
					key={`metadata-field-${detail.label}-${index}`}
				>
					<InfoItem
						icon={detail.icon}
						label={detail.label}
						value={detail.value}
					/>
				</Grid>
			))}
		</Grid>
	</InfoSection>
);
