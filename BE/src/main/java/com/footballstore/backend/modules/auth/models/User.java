package com.footballstore.backend.modules.auth.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id 
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = true) // Can be null if registering/logging in via Google OAuth
    private String password;

    private String fullName;
    private String phone;
    private String address;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AuthProvider provider = AuthProvider.LOCAL;

    private String providerId; // Google user ID

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Role role = Role.ROLE_CUSTOMER;

    @Builder.Default
    private boolean enabled = true;
    private LocalDateTime createdAt;
}
