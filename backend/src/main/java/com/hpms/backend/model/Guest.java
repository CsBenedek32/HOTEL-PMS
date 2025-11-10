package com.hpms.backend.model;

import com.hpms.backend.enumCollection.GuestTypeEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "guests")
public class Guest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String firstName;
    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false, unique = true)
    private String phoneNumber;

    private String homeCountry;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GuestTypeEnum type;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean active = true;

    @ManyToMany(mappedBy = "guests")
    private Set<Booking> bookings = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER, cascade =
            {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinTable(name = "guest_guest_tags", joinColumns = @JoinColumn(name = "guest_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "guest_tag_id", referencedColumnName = "id")
    )
    private Set<GuestTag> guestTags = new HashSet<>();


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