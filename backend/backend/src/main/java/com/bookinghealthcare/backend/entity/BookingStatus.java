package com.bookinghealthcare.backend.entity;

public enum BookingStatus {
    PENDING,      // mới đặt
    CONFIRMED,    // admin/bác sĩ xác nhận
    CANCELLED,    // hủy
    DONE          // đã khám
}
