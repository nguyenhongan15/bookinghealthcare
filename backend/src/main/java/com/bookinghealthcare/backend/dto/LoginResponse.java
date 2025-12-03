package com.bookinghealthcare.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {

    private Long id;           // id trong user_accounts
    private String username;
    private String fullName;
    private String role;       // USER / DOCTOR / ADMIN
    private Integer doctorId;  // nếu là bác sĩ thì != null
}
