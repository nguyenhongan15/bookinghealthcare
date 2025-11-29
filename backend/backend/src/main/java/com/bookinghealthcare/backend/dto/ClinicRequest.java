package com.bookinghealthcare.backend.dto;

import lombok.Data;

@Data
public class ClinicRequest {
    private String name;
    private String address;
    private String hotline;
    private String image; 
}
