import { atom } from "jotai";
import type { FormValues } from "../lib/form";

export type BookingModalStep = "baseData" | "guests" | "rooms";

export interface MultiStepBookingModalState {
	open: boolean;
	currentStep: BookingModalStep;
	formData: {
		baseData: Partial<FormValues>;
		guests: Partial<FormValues>;
		rooms: Partial<FormValues>;
	};
	isEditMode: boolean;
	editingBookingId?: number;
}

const initialState: MultiStepBookingModalState = {
	open: false,
	currentStep: "baseData",
	formData: {
		baseData: {},
		guests: {},
		rooms: {},
	},
	isEditMode: false,
	editingBookingId: undefined,
};

export const multiStepBookingModalAtom =
	atom<MultiStepBookingModalState>(initialState);

export const bookingModalOpenAtom = atom(
	(get) => get(multiStepBookingModalAtom).open,
	(get, set, value: boolean) => {
		set(multiStepBookingModalAtom, {
			...get(multiStepBookingModalAtom),
			open: value,
		});
	},
);

export const bookingModalCurrentStepAtom = atom(
	(get) => get(multiStepBookingModalAtom).currentStep,
	(get, set, value: BookingModalStep) => {
		set(multiStepBookingModalAtom, {
			...get(multiStepBookingModalAtom),
			currentStep: value,
		});
	},
);

export const bookingModalFormDataAtom = atom(
	(get) => get(multiStepBookingModalAtom).formData,
	(get, set, value: MultiStepBookingModalState["formData"]) => {
		set(multiStepBookingModalAtom, {
			...get(multiStepBookingModalAtom),
			formData: value,
		});
	},
);

export const bookingModalIsEditModeAtom = atom(
	(get) => get(multiStepBookingModalAtom).isEditMode,
);

export const bookingModalEditingIdAtom = atom(
	(get) => get(multiStepBookingModalAtom).editingBookingId,
);

export const openBookingModalForEditAtom = atom(
	null,
	(
		get,
		set,
		payload: {
			bookingId: number;
			formData: MultiStepBookingModalState["formData"];
		},
	) => {
		set(multiStepBookingModalAtom, {
			...get(multiStepBookingModalAtom),
			open: true,
			isEditMode: true,
			editingBookingId: payload.bookingId,
			formData: payload.formData,
			currentStep: "baseData",
		});
	},
);

export const resetBookingModalAtom = atom(null, (_get, set) => {
	set(multiStepBookingModalAtom, initialState);
});
