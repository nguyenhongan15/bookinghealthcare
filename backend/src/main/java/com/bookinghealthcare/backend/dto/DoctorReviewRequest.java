package com.bookinghealthcare.backend.dto;

import lombok.Data;

@Data
public class DoctorReviewRequest {
    private Integer bookingId; 
    private int rating; // 1-5
    private String comment;
}
