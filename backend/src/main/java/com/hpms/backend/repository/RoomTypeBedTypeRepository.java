package com.hpms.backend.repository;

import com.hpms.backend.model.RoomType;
import com.hpms.backend.model.RoomTypeBedType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomTypeBedTypeRepository extends JpaRepository<RoomTypeBedType, Long> {
    List<RoomTypeBedType> findByRoomType(RoomType roomType);
    void deleteByRoomType(RoomType roomType);
}