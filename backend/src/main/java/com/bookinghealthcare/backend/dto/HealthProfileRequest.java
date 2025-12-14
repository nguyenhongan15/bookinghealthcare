package com.bookinghealthcare.backend.dto;

import lombok.Data;

@Data
public class HealthProfileRequest {
    private String medicalHistory;
    private String allergies;
    private String currentMedications;
    private boolean shareWithDoctor;
}
