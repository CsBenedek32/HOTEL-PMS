package com.hpms.backend.repository;

import com.hpms.backend.model.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuildingRepository extends JpaRepository<Building, Long> {
    boolean existsByName(String name);
}