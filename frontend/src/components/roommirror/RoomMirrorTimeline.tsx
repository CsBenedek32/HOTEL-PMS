import { Box, useTheme } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import Timeline, {
	DateHeader,
	TimelineHeaders,
	TodayMarker,
} from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import "../../styles/timeline-dark.css";
import moment from "moment";
import type {
	TimelineGroup,
	TimelineItem,
} from "../../interfaces/roommirrorInterfaces";
import {
	bookingInfoDrawerAtom,
	LoadableBookingAtom,
	selectedBookingAtom,
} from "../../state/booking";
import { getTimelineContainerStyles } from "../../styles/roommirrorStyles";

interface RoomMirrorTimelineProps {
	groups: TimelineGroup[];
	items: TimelineItem[];
	defaultTimeStart: moment.Moment;
	defaultTimeEnd: moment.Moment;
	visibleTimeRange: number;
}

const RoomMirrorTimeline = ({
	groups,
	items,
	defaultTimeStart,
	defaultTimeEnd,
	visibleTimeRange,
}: RoomMirrorTimelineProps) => {
	const theme = useTheme();
	const timelineContainerRef = useRef<HTMLDivElement>(null);
	const setSelectedBooking = useSetAtom(selectedBookingAtom);
	const setBookingInfoDrawerOpen = useSetAtom(bookingInfoDrawerAtom);
	const bookingsData = useAtomValue(LoadableBookingAtom);

	useEffect(() => {
		const container = timelineContainerRef.current;
		if (!container) return;

		const preventZoom = (e: WheelEvent) => {
			if (e.ctrlKey) {
				e.preventDefault();
			}
		};

		container.addEventListener("wheel", preventZoom, { passive: false });

		return () => {
			container.removeEventListener("wheel", preventZoom);
		};
	}, []);

	return (
		<Box
			ref={timelineContainerRef}
			sx={{ flex: 1, ...getTimelineContainerStyles(theme) }}
		>
			<Timeline
				groups={groups}
				items={items}
				defaultTimeStart={defaultTimeStart}
				defaultTimeEnd={defaultTimeEnd}
				lineHeight={60}
				itemHeightRatio={0.85}
				canMove={false}
				canResize={false}
				canChangeGroup={false}
				minZoom={visibleTimeRange}
				maxZoom={visibleTimeRange}
				sidebarWidth={300}
				onItemClick={(itemId) => {
					const bookingId = parseInt(itemId.toString().split("-")[1], 10);
					if (bookingsData.state === "hasData") {
						const booking = bookingsData.data.find((b) => b.id === bookingId);
						if (booking) {
							setSelectedBooking(booking);
							setBookingInfoDrawerOpen(true);
						}
					}
				}}
			>
				<TodayMarker date={new Date()}>
					{({ styles }: { styles: React.CSSProperties }) => (
						<div
							style={{
								...styles,
								backgroundColor: theme.palette.error.main,
							}}
						/>
					)}
				</TodayMarker>
				<TimelineHeaders>
					<DateHeader
						unit="day"
						labelFormat={([startTime]: [moment.Moment, moment.Moment]) =>
							moment(startTime).format("MM.DD dddd")
						}
					/>
				</TimelineHeaders>
			</Timeline>
		</Box>
	);
};

export default RoomMirrorTimeline;
