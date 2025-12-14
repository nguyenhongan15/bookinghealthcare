package com.bookinghealthcare.backend.controller;

import com.bookinghealthcare.backend.repository.BookingRepository;

// ===== Spring =====
import org.springframework.web.bind.annotation.*;

// ===== Lombok =====
import lombok.RequiredArgsConstructor;

// ===== Service =====
import com.bookinghealthcare.backend.service.HealthProfileService;

// ===== Entity =====
import com.bookinghealthcare.backend.entity.HealthProfile;

// ===== DTO =====
import com.bookinghealthcare.backend.dto.HealthProfileRequest;
import com.bookinghealthcare.backend.dto.HealthProfileResponse;

// ===== Common =====
import com.bookinghealthcare.backend.common.ApiResponse;

@RestController
@RequestMapping("/api/health-profile")
@RequiredArgsConstructor
@CrossOrigin
public class HealthProfileController {

    private final HealthProfileService service;
    private final BookingRepository bookingRepository;

    // =====================
    // USER xem hồ sơ của mình
    // =====================
    @GetMapping("/me")
    public ApiResponse<?> getMyProfile(@RequestParam Long userId) {
        HealthProfile p = service.getOrCreate(userId);
        return ApiResponse.success(toResponse(p));
    }

    // =====================
    // USER cập nhật hồ sơ
    // =====================
    @PutMapping("/me")
    public ApiResponse<?> update(
            @RequestParam Long userId,
            @RequestBody HealthProfileRequest req
    ) {
        HealthProfile p = service.update(userId, req);
        return ApiResponse.success(toResponse(p));
    }

    // =====================
    // DOCTOR xem hồ sơ bệnh nhân
    // =====================
    @GetMapping("/patient/{userId}")
    public ApiResponse<?> doctorView(
            @PathVariable Long userId,
            @RequestParam Integer doctorId
    ) {
        boolean hasBooking = bookingRepository
                .existsByDoctor_IdAndUserAccountId(doctorId, userId);

        if (!hasBooking) {
            return ApiResponse.error(403, "Bạn không có quyền xem hồ sơ bệnh nhân này");
        }

        HealthProfile p = service.getOrCreate(userId);
        return ApiResponse.success(toResponse(p));
    }

    // =====================
    // MAP ENTITY → RESPONSE
    // =====================
    private HealthProfileResponse toResponse(HealthProfile p) {
        return HealthProfileResponse.builder()
                .medicalHistory(p.getMedicalHistory())
                .allergies(p.getAllergies())
                .currentMedications(p.getCurrentMedications())
                .shareWithDoctor(p.isShareWithDoctor())
                .build();
    }
}
