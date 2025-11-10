package com.hpms.backend.repository;

import com.hpms.backend.model.ServiceModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServiceModelRepository extends JpaRepository<ServiceModel, Long> {
    Optional<ServiceModel> findByNameAndVirtual(String name, Boolean virtual);
}