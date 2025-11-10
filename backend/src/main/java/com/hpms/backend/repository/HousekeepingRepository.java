package com.hpms.backend.repository;

import com.hpms.backend.model.Housekeeping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HousekeepingRepository extends JpaRepository<Housekeeping, Long> {
}