package com.bookinghealthcare.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatPartnerDto {

    private Long id;          // doctorId hoặc userId
    private String name;
    private String image;
    private boolean booked;   // đã đặt lịch hay chưa
}
