import { FilterList, FilterListOff } from "@mui/icons-material";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { UserData } from "../../interfaces/user";
import ButtonUI from "../../lib/ButtonUi";
import { LoadableCurrentUserAtom } from "../../state/user";

interface ShowMyTasksButtonProps {
	onFilterChange: (user: UserData | null) => void;
}

const ShowMyTasksButton = ({ onFilterChange }: ShowMyTasksButtonProps) => {
	const { t } = useTranslation();
	const [isFiltered, setIsFiltered] = useState(false);
	const loadableCurrentUser = useAtomValue(LoadableCurrentUserAtom);

	const handleClick = () => {
		if (isFiltered) {
			onFilterChange(null);
			setIsFiltered(false);
		} else {
			if (loadableCurrentUser.state === "hasData" && loadableCurrentUser.data) {
				onFilterChange(loadableCurrentUser.data);
				setIsFiltered(true);
			}
		}
	};

	return (
		<ButtonUI
			color={isFiltered ? "secondary" : "primary"}
			startIcon={isFiltered ? <FilterListOff /> : <FilterList />}
			label={t(
				isFiltered ? "housekeeping.showAllTasks" : "housekeeping.showMyTasks",
			)}
			onClick={handleClick}
			requiredPermissions={[]}
			variant={isFiltered ? "contained" : "outlined"}
		/>
	);
};

export default ShowMyTasksButton;
