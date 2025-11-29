package com.bookinghealthcare.backend.dto;

import lombok.Data;

@Data
public class BookingRequest {

    private String patientName;
    private String patientPhone;
    private String note;

    private Integer doctorId;
    private Integer scheduleSlotId;
}
