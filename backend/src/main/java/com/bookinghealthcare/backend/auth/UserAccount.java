package com.bookinghealthcare.backend.auth;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_accounts",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username")
        })
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class UserAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;
    private String phone;

    @Column(nullable = true, unique = true) 
    private String email;

    @Column(name = "full_name")
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;


    private Integer doctorId;

    private LocalDateTime createdAt;

    @Column(name = "welcome_email_sent", nullable = false)
    @Builder.Default
    private boolean welcomeEmailSent = false;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
