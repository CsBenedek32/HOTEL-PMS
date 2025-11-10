// RoomStatusEnum
export const RoomStatus = {
	DIRTY: "DIRTY",
	CLEAN: "CLEAN",
	OUT_OF_SERVICE: "OUT_OF_SERVICE",
} as const;
export type RoomStatus = (typeof RoomStatus)[keyof typeof RoomStatus];

// BookingStatusEnum
export const BookingStatus = {
	RESERVED: "RESERVED",
	CHECKED_IN: "CHECKED_IN",
	CHECKED_OUT: "CHECKED_OUT",
	CANCELLED: "CANCELLED",
	NO_SHOW: "NO_SHOW",
	WAITLISTED: "WAITLISTED",
	BLOCKED: "BLOCKED",
} as const;
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

// PaymentStatusEnum
export const PaymentStatus = {
	FULFILLED: "FULFILLED",
	CANCELLED: "CANCELLED",
	PENDING: "PENDING",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

// HousekeepingStatus
export const HousekeepingStatus = {
	TO_DO: "TO_DO",
	IN_PROGRESS: "IN_PROGRESS",
	DONE: "DONE",
} as const;
export type HousekeepingStatus =
	(typeof HousekeepingStatus)[keyof typeof HousekeepingStatus];

// HousekeepingPriorityEnum
export const HousekeepingPriority = {
	LOW: "LOW",
	MEDIUM: "MEDIUM",
	HIGH: "HIGH",
	URGENT: "URGENT",
} as const;
export type HousekeepingPriority =
	(typeof HousekeepingPriority)[keyof typeof HousekeepingPriority];

// BookingInvoiceEnum
export const BookingInvoiceStatus = {
	NOT_SYNCED: "NOT_SYNCED",
	SYNCED: "SYNCED",
	NO_INVOICE: "NO_INVOICE",
} as const;
export type BookingInvoiceStatus =
	(typeof BookingInvoiceStatus)[keyof typeof BookingInvoiceStatus];

// GuestTypeEnum
export const GuestType = {
	ADULT: "ADULT",
	CHILD: "CHILD",
} as const;
export type GuestType = (typeof GuestType)[keyof typeof GuestType];
