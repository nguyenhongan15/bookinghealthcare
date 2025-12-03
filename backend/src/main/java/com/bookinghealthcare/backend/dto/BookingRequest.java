package com.bookinghealthcare.backend.dto;

import lombok.Data;

@Data
public class BookingRequest {

    private String patientName;
    private String patientPhone;
    private String note;
    private String email;

    private Integer doctorId;
    private Integer scheduleSlotId;
    private String gender;
    private Integer birthyear;
    private String province;
    private String district;
    private String reason;

    private String doctorName;
    private String doctorLocation;
    private String date;
    private String slot;

    private String nameclinic;
    private String addressclinic;
    private Long userAccountId;
}
