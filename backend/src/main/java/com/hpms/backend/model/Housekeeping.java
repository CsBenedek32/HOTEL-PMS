package com.hpms.backend.model;

import com.hpms.backend.enumCollection.HousekeepingPriorityEnum;
import com.hpms.backend.enumCollection.HousekeepingStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "housekeeping")
public class Housekeeping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = true)
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "room_id", referencedColumnName = "id")
    private Room room;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Enumerated(EnumType.STRING)
    private HousekeepingStatus status;

    @Enumerated(EnumType.STRING)
    private HousekeepingPriorityEnum priority = HousekeepingPriorityEnum.LOW;

    private LocalDate assignedDate;
    private LocalDate completionDate;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}