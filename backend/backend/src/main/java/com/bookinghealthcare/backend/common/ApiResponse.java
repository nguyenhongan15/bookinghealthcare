package com.bookinghealthcare.backend.common;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse<T> {
    private int status;
    private boolean success;
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, true, "Success", data);
    }

    public static <T> ApiResponse<T> success(String msg, T data) {
        return new ApiResponse<>(200, true, msg, data);
    }

    public static ApiResponse<?> error(int status, String msg) {
        return new ApiResponse<>(status, false, msg, null);
    }
}
