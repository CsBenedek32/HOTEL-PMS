package com.hpms.backend.repository;

import com.hpms.backend.model.BedType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BedTypeRepository extends JpaRepository<BedType, Long> {
    Optional<BedType> findByBedTypeName(String bedTypeName);
}