import { Box, Divider } from "@mui/material";
import { useEffect, useId, useState } from "react";
import InvoiceInfoPanel from "../components/invoice/InvoiceInfoPanel";
import InvoiceTable from "../components/invoice/InvoiceTable";

function InvoicePage() {
	const [leftWidth, setLeftWidth] = useState(25);
	const [isDragging, setIsDragging] = useState(false);
	const id = useId();

	const handleMouseDown = () => {
		setIsDragging(true);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!isDragging) return;

		const container = document.getElementById(id);
		if (!container) return;

		const containerRect = container.getBoundingClientRect();
		const newLeftWidth =
			((e.clientX - containerRect.left) / containerRect.width) * 100;
		if (newLeftWidth >= 20 && newLeftWidth <= 80) {
			setLeftWidth(newLeftWidth);
		}
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies(handleMouseMove): suppress dependency array linting
	// biome-ignore lint/correctness/useExhaustiveDependencies(handleMouseUp): suppress dependency array linting
	useEffect(() => {
		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove as never);
			document.addEventListener("mouseup", handleMouseUp);
		} else {
			document.removeEventListener("mousemove", handleMouseMove as never);
			document.removeEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove as never);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging]);

	return (
		<Box
			id={id}
			sx={{
				height: "100vh",
				width: "100%",
				display: "flex",
				flexDirection: "row",
				overflow: "hidden",
			}}
		>
			<Box sx={{ width: `${leftWidth}%`, overflow: "hidden" }}>
				<InvoiceTable />
			</Box>
			<Divider
				orientation="vertical"
				sx={{
					width: "4px",
					cursor: "col-resize",
					backgroundColor: isDragging ? "primary.main" : "divider",
					transition: isDragging ? "none" : "background-color 0.2s",
					"&:hover": {
						backgroundColor: "primary.light",
					},
				}}
				onMouseDown={handleMouseDown}
			/>

			<Box
				sx={{
					width: `${100 - leftWidth}%`,
					height: "calc(100vh - 50px)",
					overflow: "hidden",
				}}
			>
				<InvoiceInfoPanel />
			</Box>
		</Box>
	);
}

export default InvoicePage;
