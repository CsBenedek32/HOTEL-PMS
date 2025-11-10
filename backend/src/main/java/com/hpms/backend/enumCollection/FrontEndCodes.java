package com.hpms.backend.enumCollection;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum FrontEndCodes {

    SUCCESS("SUCCESS", "Operation completed successfully"),
    ERROR("ERROR", "An error occurred"),
    COMMON_GENERAL_ERROR("GEN_001", "An unexpected error occurred"),
    COMMON_VALIDATION_ERROR("GEN_002", "Validation failed"),
    COMMON_RESOURCE_NOT_FOUND("GEN_003", "Resource not found"),
    COMMON_ALREADY_EXISTS("GEN_004", "Resource already exists"),
    COMMON_ACCESS_DENIED("GEN_005", "Access denied"),

    // Guest errors
    GUEST_NOT_FOUND("GUEST_001", "Guest not found"),
    GUEST_ALREADY_EXISTS("GUEST_002", "Guest already exists"),
    GUEST_EMAIL_EXISTS("GUEST_003", "Guest with this email already exists"),
    GUEST_PHONE_EXISTS("GUEST_004", "Guest with this phone number already exists"),
    GUEST_INVALID_TYPE("GUEST_005", "Invalid guest type"),

    // Room errors
    ROOM_NOT_FOUND("ROOM_001", "Room not found"),
    ROOM_ALREADY_EXISTS("ROOM_002", "Room already exists"),
    ROOM_UNAVAILABLE("ROOM_003", "Room is not available"),
    ROOM_TYPE_NOT_FOUND("ROOM_004", "Room type not found"),
    ROOM_BUILDING_NOT_FOUND("ROOM_005", "Building not found"),
    ROOM_HAS_BOOKINGS("ROOM_006", "Cannot delete room that has associated bookings"),

    // Booking errors
    BOOKING_NOT_FOUND("BOOKING_001", "Booking not found"),
    BOOKING_CONFLICT("BOOKING_002", "Room conflict for booking dates"),
    BOOKING_INVALID_STATUS("BOOKING_003", "Invalid booking status transition"),
    BOOKING_ROOM_UNAVAILABLE("BOOKING_004", "One or more rooms are not available for the requested dates"),
    BOOKING_ROOMS_NOT_FOUND("BOOKING_005", "One or more rooms not found"),
    BOOKING_GUESTS_NOT_FOUND("BOOKING_006", "One or more guests not found"),
    BOOKING_INVALID_DATES("BOOKING_007", "Invalid check-in or check-out dates"),
    BOOKING_CHECKOUT_BEFORE_CHECKIN("BOOKING_008", "Check-out date must be after check-in date"),
    BOOKING_NOT_ACTIVE("BOOKING_009", "Booking isn't active"),

    // Invoice errors
    INVOICE_NOT_FOUND("INVOICE_001", "Invoice not found"),
    INVOICE_SYNC_FAILED("INVOICE_002", "Failed to sync invoice with bookings"),
    INVOICE_BOOKING_NOT_FOUND("INVOICE_003", "Initial booking not found"),
    INVOICE_SERVICE_NOT_FOUND("INVOICE_004", "One or more services not found"),
    INVOICE_INVALID_STATUS("INVOICE_005", "Invalid invoice payment status"),
    INVOICE_CALCULATION_ERROR("INVOICE_006", "Error calculating invoice total"),
    INVOICE_BOOKING_IS_TAKEN("INVOICE_007","This booking belongs to another Invoice"),
    INVOICE_BOOKING_MISSMATCH("INVOICE_008", "This booking doenst belong to this invoice"),
    // Room Type errors
    ROOM_TYPE_OBJ_NOT_FOUND("ROOM_TYPE_001", "Room type not found"),
    ROOM_TYPE_ALREADY_EXISTS("ROOM_TYPE_002", "Room type already exists"),
    ROOM_TYPE_HAS_ROOMS("ROOM_TYPE_003", "Cannot delete room type that has associated rooms"),

    // Building errors
    BUILDING_NOT_FOUND("BUILDING_001", "Building not found"),
    BUILDING_ALREADY_EXISTS("BUILDING_002", "Building already exists"),
    BUILDING_HAS_ROOMS("BUILDING_003", "Cannot delete building that has associated rooms"),

    // Service Model errors
    SERVICE_MODEL_NOT_FOUND("SERVICE_001", "Service model not found"),
    SERVICE_MODEL_ALREADY_EXISTS("SERVICE_002", "Service model already exists"),
    SERVICE_MODEL_HAS_INVOICES("SERVICE_003", "Cannot delete service model that has associated invoices"),
    SERVICE_MODEL_VAT_NOT_FOUND("SERVICE_004", "VAT not found for service model"),
    SERVICE_MODEL_BASE_DELETE("SERVICE_005", "Cannot delete the base rooms cost service model"),
    SERVICE_MODEL_IMMUTABLE_DELETE("SERVICE_006", "Cannot delete an immutable service model"),

    // VAT errors
    VAT_NOT_FOUND("VAT_001", "VAT not found"),
    VAT_ALREADY_EXISTS("VAT_002", "VAT already exists"),
    VAT_HAS_SERVICES("VAT_003", "Cannot delete VAT that has associated service models"),
    VAT_INVALID_PERCENTAGE("VAT_004", "Invalid VAT percentage"),

    // Guest Tag errors
    GUEST_TAG_NOT_FOUND("TAG_001", "Guest tag not found"),
    GUEST_TAG_ALREADY_EXISTS("TAG_002", "Guest tag already exists"),
    GUEST_TAG_HAS_GUESTS("TAG_003", "Cannot delete guest tag that has associated guests"),

    // Amenity errors
    AMENITY_NOT_FOUND("AMENITY_001", "Amenity not found"),
    AMENITY_ALREADY_EXISTS("AMENITY_002", "Amenity already exists"),
    AMENITY_HAS_ROOMS("AMENITY_003", "Cannot delete amenity that has associated rooms"),

    // Bed Type errors
    BED_TYPE_NOT_FOUND("BED_TYPE_001", "Bed type not found"),
    BED_TYPE_ALREADY_EXISTS("BED_TYPE_002", "Bed type already exists"),
    BED_TYPE_HAS_ROOM_TYPES("BED_TYPE_003", "Cannot delete bed type that has associated room types"),

    // Housekeeping errors
    HOUSEKEEPING_NOT_FOUND("HOUSEKEEPING_001", "Housekeeping task not found"),
    HOUSEKEEPING_ALREADY_EXISTS("HOUSEKEEPING_002", "Housekeeping task already exists"),
    HOUSEKEEPING_USER_NOT_FOUND("HOUSEKEEPING_003", "User not found for housekeeping assignment"),
    HOUSEKEEPING_ROOM_NOT_FOUND("HOUSEKEEPING_004", "Room not found for housekeeping task"),

    // Role errors
    ROLE_NOT_FOUND("ROLE_001", "Role not found"),
    ROLE_ALREADY_EXISTS("ROLE_002", "Role already exists"),
    ROLE_HAS_USERS("ROLE_003", "Cannot delete role that is assigned to users"),
    ROLE_IS_IMMUTABLE("ROLE_004","Role is immutable"),

    // Authentication errors
    AUTH_INVALID_CREDENTIALS("AUTH_001", "Invalid credentials"),
    AUTH_TOKEN_EXPIRED("AUTH_002", "Authentication token expired"),
    AUTH_TOKEN_INVALID("AUTH_003", "Invalid authentication token"),
    AUTH_INSUFFICIENT_PERMISSIONS("AUTH_004", "Insufficient permissions"),
    AUTH_ACCOUNT_DISABLED("AUTH_005", "Account is disabled"),

    // Date/Time errors
    DATE_INVALID_FORMAT("DATE_001", "Invalid date format"),
    DATE_PAST_DATE("DATE_002", "Date cannot be in the past"),
    DATE_RANGE_INVALID("DATE_003", "Invalid date range"),

    // File/Upload errors
    FILE_NOT_FOUND("FILE_001", "File not found"),
    FILE_UPLOAD_FAILED("FILE_002", "File upload failed"),
    FILE_INVALID_FORMAT("FILE_003", "Invalid file format"),
    FILE_SIZE_EXCEEDED("FILE_004", "File size limit exceeded");

    private final String code;
    private final String defaultMessage;
}