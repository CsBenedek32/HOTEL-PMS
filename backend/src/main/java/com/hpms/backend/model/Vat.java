package com.hpms.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Collection;
import java.util.HashSet;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vat")
public class Vat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private Double percentage;

    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "vat")
    private Collection<ServiceModel> serviceModels = new HashSet<>();
}