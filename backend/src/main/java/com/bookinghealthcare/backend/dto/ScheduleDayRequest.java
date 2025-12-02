package com.bookinghealthcare.backend.dto;

import lombok.Data;

@Data
public class ScheduleDayRequest {
    private Integer doctorId;
    private String day;  
}
