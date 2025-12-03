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
    private Long id;            // trùng với id của UserAccount

    private String username;
    private String fullName;
    private String email;

    private Integer doctorId;   // map sang bảng Doctor nếu cần

    private LocalDateTime createdAt;
}
