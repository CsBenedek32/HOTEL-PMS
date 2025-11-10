package com.hpms.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "data_init_flags")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DataInitFlag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String flagKey;

    @Column(nullable = false)
    private Boolean completed = false;
}