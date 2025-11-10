import type {
	TimelineGroupBase,
	TimelineItemBase,
} from "react-calendar-timeline";

export interface TimelineGroup extends TimelineGroupBase {
	id: number;
	title: string;
	rightTitle?: string;
}

export interface TimelineItem extends TimelineItemBase<number> {
	id: string;
	group: number;
	title: string;
	start_time: number;
	end_time: number;
	itemProps?: {
		style?: React.CSSProperties;
	};
	style?: React.CSSProperties;
}
