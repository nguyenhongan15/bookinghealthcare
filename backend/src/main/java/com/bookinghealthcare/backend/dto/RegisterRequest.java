package com.bookinghealthcare.backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String fullName;
    private String phone;
    private String password;
    private String email;
}
