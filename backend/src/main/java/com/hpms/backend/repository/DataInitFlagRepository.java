package com.hpms.backend.repository;

import com.hpms.backend.model.DataInitFlag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DataInitFlagRepository extends JpaRepository<DataInitFlag, Long> {
    Optional<DataInitFlag> findByFlagKey(String flagKey);
    boolean existsByFlagKeyAndCompleted(String flagKey, Boolean completed);
}