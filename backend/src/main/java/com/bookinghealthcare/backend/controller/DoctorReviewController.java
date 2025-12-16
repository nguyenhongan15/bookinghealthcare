package com.bookinghealthcare.backend.controller;

import com.bookinghealthcare.backend.common.ApiResponse;
import com.bookinghealthcare.backend.dto.DoctorReviewRequest;
import com.bookinghealthcare.backend.service.DoctorReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin
public class DoctorReviewController {

    private final DoctorReviewService reviewService;

    @PostMapping
    public ApiResponse<?> create(@RequestBody DoctorReviewRequest req) {
        return ApiResponse.success(reviewService.createReview(req));
    }

    @GetMapping("/doctor/{doctorId}")
    public ApiResponse<?> getByDoctor(@PathVariable Long doctorId) {
        return ApiResponse.success(reviewService.getReviewsByDoctor(doctorId));
    }
}
