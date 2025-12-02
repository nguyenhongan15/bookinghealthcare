package com.bookinghealthcare.backend.dto;

import com.bookinghealthcare.backend.entity.BookingStatus;
import lombok.Data;

@Data
public class BookingStatusRequest {
    private BookingStatus status;
}
