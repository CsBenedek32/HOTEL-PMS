package com.hpms.backend.enumCollection;

public enum BookingStatusEnum {
    RESERVED,       // Booking is created but not yet checked in
    CHECKED_IN,     // Guest has checked in
    CHECKED_OUT,    // Guest has checked out, stay completed
    CANCELLED,      // Booking cancelled before check-in
    NO_SHOW,        // Guest never arrived, and booking was not cancelled
    WAITLISTED,     // Optional: not confirmed, waiting for availability
    BLOCKED        // Optional: reserved internally for maintenance, staff use, etc
}