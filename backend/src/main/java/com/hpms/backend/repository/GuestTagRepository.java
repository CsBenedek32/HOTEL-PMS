package com.hpms.backend.repository;

import com.hpms.backend.model.GuestTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GuestTagRepository extends JpaRepository<GuestTag, Long> {
    Optional<GuestTag> findByTagName(String tagName);
}