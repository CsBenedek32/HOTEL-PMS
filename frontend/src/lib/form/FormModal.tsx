import {
	Box,
	Button,
	Dialog,
	DialogActions,
	Stack,
	Typography,
} from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import {
	formModalButtonsAtom,
	formModalConfigAtom,
	formModalInitialValuesAtom,
	formModalOnSubmitAtom,
	formModalOpenAtom,
	formModalTitleAtom,
} from "../../state/formModal";
import ButtonUI from "../ButtonUi";
import { FormFactory } from "./FormFactory";
import type { FormErrors, FormValues } from "./types";
import { hasErrors, validateForm } from "./validation";

export const FormModal = <T extends FormValues = FormValues>() => {
	const open = useAtomValue(formModalOpenAtom);
	const title = useAtomValue(formModalTitleAtom);
	const config = useAtomValue(formModalConfigAtom);
	const initialValues = useAtomValue(formModalInitialValuesAtom);
	const onSubmit = useAtomValue(formModalOnSubmitAtom);
	const buttons = useAtomValue(formModalButtonsAtom);
	const setOpen = useSetAtom(formModalOpenAtom);

	const valuesRef = useRef<FormValues>(initialValues as FormValues);
	const [errors, setErrors] = useState<FormErrors>({});

	const handleClose = () => setOpen(false);

	const handleSave = async () => {
		if (!config || !onSubmit) return;

		const validationErrors = validateForm(valuesRef.current, config);

		setErrors(validationErrors);

		if (!hasErrors(validationErrors)) {
			await onSubmit(valuesRef.current as T);
		}
	};

	useEffect(() => {
		if (open) {
			valuesRef.current = { ...initialValues } as FormValues;
			setErrors({});
		}
	}, [open, initialValues]);

	if (!config) return null;

	return (
		<Dialog
			open={open}
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
			<Typography sx={{ fontWeight: "bold", padding: 2 }} variant="h5">
				{title}
			</Typography>
			<Box sx={{ padding: 2 }}>
				<FormFactory
					config={config}
					initialValues={initialValues}
					valuesRef={valuesRef}
					errors={errors}
				/>
			</Box>
			<DialogActions>
				<Stack
					direction="row"
					spacing={2}
					sx={{ padding: 1, flexGrow: 1, justifyContent: "space-between" }}
				>
					{buttons.cancel && (
						<Button
							onClick={handleClose}
							color="secondary"
							sx={{ minWidth: 120 }}
							variant="contained"
						>
							Cancel
						</Button>
					)}
					{buttons.save && (
						<ButtonUI
							label="Save"
							sx={{ minWidth: 120 }}
							onClick={handleSave}
							color="primary"
							variant="contained"
						/>
					)}
				</Stack>
			</DialogActions>
		</Dialog>
	);
};
