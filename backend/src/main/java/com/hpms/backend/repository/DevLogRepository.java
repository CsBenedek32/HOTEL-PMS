package com.hpms.backend.repository;

import com.hpms.backend.model.DevLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DevLogRepository extends JpaRepository<DevLog, Long> {
}