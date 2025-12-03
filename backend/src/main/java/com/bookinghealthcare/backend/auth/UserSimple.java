package com.bookinghealthcare.backend.auth;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_simple_view")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSimple {

    @Id
    private Long id;           // trùng với id của UserAccount

    private String username;
    private String fullName;
    private String phone;

    private LocalDateTime createdAt;
}
