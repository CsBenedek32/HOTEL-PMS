import type { Theme } from "@mui/material";
import moment from "moment";
import type { RoomMirrorData } from "../interfaces/roomMirror";
import type {
	TimelineGroup,
	TimelineItem,
} from "../interfaces/roommirrorInterfaces";
import { getBookingStatusColor } from "./statusUtils";

export const getColorFromBookingStatus = (
	status: string,
	theme: Theme,
): string => {
	const colorType = getBookingStatusColor(status);
	switch (colorType) {
		case "success":
			return theme.palette.success.main;
		case "info":
			return theme.palette.info.main;
		case "warning":
			return theme.palette.warning.main;
		case "error":
			return theme.palette.error.main;
		case "primary":
			return theme.palette.primary.main;
		case "secondary":
			return theme.palette.secondary.main;
		default:
			return theme.palette.grey[500];
	}
};

export const createTimelineData = (rooms: RoomMirrorData[], theme: Theme) => {
	const timelineGroups: TimelineGroup[] = [];
	const timelineItems: TimelineItem[] = [];

	rooms.forEach((room) => {
		timelineGroups.push({
			id: room.id,
			title: `${room.roomNumber} - ${room.roomType.typeName}`,
			rightTitle: room.roomType.typeName,
		});

		const sortedBookings = [...room.bookings].sort(
			(a, b) =>
				new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime(),
		);

		sortedBookings.forEach((booking, index) => {
			const backgroundColor = getColorFromBookingStatus(booking.status, theme);
			const startTime = moment(booking.checkInDate)
				.hours(11)
				.minutes(59)
				.seconds(0)
				.milliseconds(0)
				.valueOf();
			const endTime = moment(booking.checkOutDate)
				.hours(12)
				.minutes(1)
				.seconds(0)
				.milliseconds(0)
				.valueOf();
			const clipPath =
				"polygon(0% 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 0% 100%, 10px 50%)";

			timelineItems.push({
				id: `${room.id}-${booking.id || index}`,
				group: room.id,
				title: booking.name,
				start_time: startTime,
				end_time: endTime,
				itemProps: {
					style: {
						background: backgroundColor,
						clipPath: clipPath,
						paddingLeft: "16px",
					},
				},
			});
		});
	});

	const minRows = 13;
	const currentRows = timelineGroups.length;

	if (currentRows < minRows) {
		const roomsToAdd = minRows - currentRows;
		for (let i = 0; i < roomsToAdd; i++) {
			const emptyId = -(i + 1);
			timelineGroups.push({
				id: emptyId,
				title: "",
				rightTitle: "",
			});
		}
	}

	return {
		groups: timelineGroups,
		items: timelineItems,
	};
};

export const getDefaultTimeRange = () => {
	const yesterday = moment().subtract(1, "day").startOf("day");
	const oneWeekFromNow = moment().add(7, "days").endOf("day");
	const range = oneWeekFromNow.diff(yesterday);

	return {
		defaultTimeStart: yesterday,
		defaultTimeEnd: oneWeekFromNow,
		visibleTimeRange: range,
	};
};
