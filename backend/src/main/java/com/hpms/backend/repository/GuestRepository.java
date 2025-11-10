package com.hpms.backend.repository;

import com.hpms.backend.model.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Long> {
    Optional<Guest> findByPhoneNumber(String phoneNumber);

    Optional<Guest> findByEmail(String email);
}