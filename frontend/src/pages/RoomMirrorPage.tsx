import { Upload } from "@mui/icons-material";
import {
	Box,
	Drawer,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	useTheme,
} from "@mui/material";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useId, useMemo } from "react";
import { useTranslation } from "react-i18next";
import BookingInfo from "../components/booking/BookingInfo";
import { MultiStepBookingModal } from "../components/booking/MultiStepBookingModal";
import RoomMirrorTimeline from "../components/roommirror/RoomMirrorTimeline";
import {
	bookingBaseDataFormConfig,
	bookingGuestsFormConfig,
	bookingRoomsFormConfig,
} from "../config/forms/bookingForm";
import ButtonUI from "../lib/ButtonUi";
import type { FormValues } from "../lib/form";
import { FormModal } from "../lib/form/FormModal";
import { bookingInfoDrawerAtom } from "../state/booking";
import { LoadableBuildingAtom } from "../state/building";
import { reloadTimestampAtom } from "../state/common";
import { loadingModalAtom, loadingModalMessageAtom } from "../state/loading";
import { bookingModalOpenAtom } from "../state/multiStepBookingModal";
import {
	LoadableRoomMirrorAtom,
	selectedBuildingIdAtom,
} from "../state/roomMirror";
import {
	handleBookingEdit as editBooking,
	handleBookingSubmit as submitBooking,
} from "../utils/bookingUtils";
import {
	createTimelineData,
	getDefaultTimeRange,
} from "../utils/roommirrorUtils";

const RoomMirrorPage = () => {
	const { t } = useTranslation();
	const theme = useTheme();
	const buildingLabelId = useId();

	const [buildingId, setBuildingId] = useAtom(selectedBuildingIdAtom);
	const [roomMirrorData] = useAtom(LoadableRoomMirrorAtom);
	const buildingsData = useAtomValue(LoadableBuildingAtom);
	const setLoadingModalOpen = useSetAtom(loadingModalAtom);
	const setLoadingModalMessage = useSetAtom(loadingModalMessageAtom);
	const [bookingInfoDrawerOpen, setBookingInfoDrawerOpen] = useAtom(
		bookingInfoDrawerAtom,
	);
	const setBookingModalOpen = useSetAtom(bookingModalOpenAtom);
	const setReloadTimestamp = useSetAtom(reloadTimestampAtom);

	const buildings: { value: number; label: string }[] = useMemo(() => {
		if (buildingsData.state !== "hasData") {
			return [];
		}
		return buildingsData.data.map((b) => ({ value: b.id, label: b.name }));
	}, [buildingsData]);

	useEffect(() => {
		if (!buildingId && buildings.length > 0) {
			setBuildingId(buildings[0].value);
		}
	}, [buildingId, buildings, setBuildingId]);

	const { groups, items } = useMemo(() => {
		if (roomMirrorData.state !== "hasData") {
			return { groups: [], items: [] };
		}

		return createTimelineData(roomMirrorData.data, theme);
	}, [roomMirrorData, theme]);

	const { defaultTimeStart, defaultTimeEnd, visibleTimeRange } = useMemo(() => {
		return getDefaultTimeRange();
	}, []);

	useEffect(() => {
		if (roomMirrorData.state === "loading") {
			setLoadingModalMessage(t("common.loading"));
			setLoadingModalOpen(true);
		} else {
			setLoadingModalOpen(false);
		}
	}, [roomMirrorData.state, setLoadingModalOpen, setLoadingModalMessage, t]);

	const handleBookingSubmit = async (allData: {
		baseData: FormValues;
		guests: FormValues;
		rooms: FormValues;
	}) => {
		const res = await submitBooking(allData);
		if (!res.error && res.data) {
			setReloadTimestamp(Date.now());
		}
	};

	const handleBookingEdit = async (
		bookingId: number,
		allData: {
			baseData: FormValues;
			guests: FormValues;
			rooms: FormValues;
		},
	) => {
		const res = await editBooking(bookingId, allData);
		if (!res.error && res.data) {
			setReloadTimestamp(Date.now());
		}
	};

	if (roomMirrorData.state === "hasError") {
		return <Box p={3}>{t("common.error")}</Box>;
	}

	if (roomMirrorData.state === "loading") {
		return null;
	}

	return (
		<Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
			<Box sx={{ p: 2, bgcolor: "background.paper" }}>
				<Stack
					direction="row"
					spacing={2}
					alignItems="center"
					flexWrap="wrap"
					justifyContent="space-between"
				>
					<FormControl sx={{ minWidth: 200 }}>
						<InputLabel id={buildingLabelId}>{t("room.building")}</InputLabel>
						<Select
							labelId={buildingLabelId}
							value={buildingId || ""}
							label={t("room.building")}
							onChange={(event) => {
								setBuildingId(event.target.value as number);
							}}
						>
							{buildings.map((building) => (
								<MenuItem key={building.value} value={building.value}>
									{building.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<ButtonUI
						color="primary"
						startIcon={<Upload />}
						label={t("booking.upload")}
						onClick={() => setBookingModalOpen(true)}
						variant="contained"
						size="large"
						requiredPermissions={["Admin", "Receptionist"]}
					/>
				</Stack>
			</Box>

			<RoomMirrorTimeline
				groups={groups}
				items={items}
				defaultTimeStart={defaultTimeStart}
				defaultTimeEnd={defaultTimeEnd}
				visibleTimeRange={visibleTimeRange}
			/>
			<Drawer
				anchor="right"
				open={bookingInfoDrawerOpen}
				onClose={() => setBookingInfoDrawerOpen(false)}
				slotProps={{
					paper: { sx: { width: "50%", height: "100%", padding: 2 } },
				}}
			>
				<BookingInfo />
			</Drawer>
			<MultiStepBookingModal
				baseDataConfig={bookingBaseDataFormConfig}
				guestsConfig={bookingGuestsFormConfig}
				roomsConfig={bookingRoomsFormConfig}
				onSubmit={handleBookingSubmit}
				onEdit={handleBookingEdit}
			/>
			<FormModal />
		</Box>
	);
};

export default RoomMirrorPage;
