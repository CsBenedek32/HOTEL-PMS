package com.hpms.backend.repository;

import com.hpms.backend.model.Vat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VatRepository extends JpaRepository<Vat, Long> {
    Optional<Vat> findByName(String name);
}