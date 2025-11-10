import type { FormValues } from "../lib/form";
import type { BookingData } from "./booking";
import type { PaymentStatus } from "./enums";
import type { ServiceData } from "./service";

export interface InvoiceData {
	id: number;
	paymentStatus: PaymentStatus;
	name: string;
	description?: string;
	totalSum?: number;
	active: boolean;
	createdAt: Date;
	updatedAt?: Date;
	recipientName?: string;
	recipientCompanyName?: string;
	recipientAddress?: string;
	recipientCity?: string;
	recipientPostalCode?: string;
	recipientCountry?: string;
	recipientTaxNumber?: string;
	recipientEmail?: string;
	recipientPhone?: string;
	bookings: BookingData[];
	serviceModels: ServiceData[];
}

export interface CreateInvoicePayload {
	name: string;
	initialBookingId?: number;
}

export interface UpdateInvoicePayload {
	paymentStatus?: PaymentStatus;
	name?: string;
	description?: string;
	recipientName?: string;
	recipientCompanyName?: string;
	recipientAddress?: string;
	recipientCity?: string;
	recipientPostalCode?: string;
	recipientCountry?: string;
	recipientTaxNumber?: string;
	recipientEmail?: string;
	recipientPhone?: string;
	bookingIds?: number[];
	serviceModelIds?: number[];
}

export interface InvoiceFormData extends FormValues {
	paymentStatus: PaymentStatus;
	name: string;
	description: string;
	recipientName: string;
	recipientCompanyName: string;
	recipientAddress: string;
	recipientCity: string;
	recipientPostalCode: string;
	recipientCountry: string;
	recipientTaxNumber: string;
	recipientEmail: string;
	recipientPhone: string;
	bookingIds: number[];
	serviceModelIds: number[];
}
