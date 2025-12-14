package com.bookinghealthcare.backend.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class HealthProfileResponse {
    private String medicalHistory;
    private String allergies;
    private String currentMedications;
    private boolean shareWithDoctor;
}
