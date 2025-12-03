package com.bookinghealthcare.backend.dto;

import lombok.Data;

@Data
public class DoctorRequest {
    private String name;
    private String image;
    private String description;
    private String expertise;
    private String location;
    private Integer specialityId;   // Frontend gửi ID chuyên khoa
    private Integer clinicId;
    private String email;

}
