package com.bookinghealthcare.backend.dto;

import lombok.Data;

@Data
public class ScheduleSlotRequest {
    private Integer scheduleDayId;
    private String slot;  // hh:mm - hh:mm
}
