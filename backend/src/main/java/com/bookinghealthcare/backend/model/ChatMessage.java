package com.bookinghealthcare.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private Integer doctorId;
    private Long userId;
    private String content;
    private String fromRole; // "USER" hoặc "DOCTOR"
}
