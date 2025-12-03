package com.bookinghealthcare.backend.auth;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctor_simple_view")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorSimple {

    @Id
    private Long id;

    private String username;
    private String fullName;
    private String email;

    private Integer doctorId;

    private LocalDateTime createdAt;
}
