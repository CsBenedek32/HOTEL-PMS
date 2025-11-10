import { Upload } from "@mui/icons-material";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { postService } from "../../api/serviceApi";
import { getVats } from "../../api/vatApi";
import { serviceFormConfig } from "../../config/forms/serviceForm";
import type { ServiceFormData } from "../../interfaces/service";
import ButtonUI from "../../lib/ButtonUi";
import type { FormValues } from "../../lib/form";
import { reloadTimestampAtom } from "../../state/common";
import {
	formModalConfigAtom,
	formModalInitialValuesAtom,
	formModalOnSubmitAtom,
	formModalOpenAtom,
	formModalTitleAtom,
} from "../../state/formModal";

const UploadNewServiceBtn = () => {
	const { t } = useTranslation();
	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);
	const setFormModalOpen = useSetAtom(formModalOpenAtom);
	const setTitle = useSetAtom(formModalTitleAtom);
	const setConfig = useSetAtom(formModalConfigAtom);
	const setInitialValues = useSetAtom(formModalInitialValuesAtom);
	const setOnSubmit = useSetAtom(formModalOnSubmitAtom);
	const [vats, setVats] = useState<{ value: number; label: string }[]>([]);

	useEffect(() => {
		const loadVats = async () => {
			const vatsData = await getVats();
			setVats(
				vatsData.map((vat) => ({
					value: vat.id,
					label: `${vat.name} (${vat.percentage}%)`,
				})),
			);
		};
		loadVats();
	}, []);

	const handleSubmit = async (values: ServiceFormData) => {
		const res = await postService(values);
		if (!res.error) {
			setReloadTimestamp(Date.now());
			setFormModalOpen(false);
		}
	};

	const handleClick = () => {
		setTitle(t("service.uploadTitle"));
		const configWithVats = {
			...serviceFormConfig,
			vatId: {
				...serviceFormConfig.vatId,
				options: vats,
			},
		};
		setConfig(configWithVats);
		setInitialValues({ cost: 0 });
		setOnSubmit(() => handleSubmit as (values: FormValues) => Promise<void>);
		setFormModalOpen(true);
	};

	return (
		<ButtonUI
			color="primary"
			startIcon={<Upload />}
			label={t("service.upload")}
			onClick={handleClick}
			requiredPermissions={["Admin", "Invoice Manager"]}
			variant="contained"
		/>
	);
};

export default UploadNewServiceBtn;
