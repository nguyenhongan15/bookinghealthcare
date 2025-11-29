package com.bookinghealthcare.backend.controller;

import com.bookinghealthcare.backend.common.ApiResponse;
import com.bookinghealthcare.backend.dto.ClinicRequest;
import com.bookinghealthcare.backend.entity.Clinic;
import com.bookinghealthcare.backend.repository.ClinicRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/clinics")
@RequiredArgsConstructor
@CrossOrigin
public class ClinicController {

    private final ClinicRepository clinicRepository;

    // Lấy tất cả cơ sở y tế
    @GetMapping
    public ApiResponse<?> getAllClinics() {
        return ApiResponse.success("Get all clinics", clinicRepository.findAll());
    }

    // Lấy theo ID
    @GetMapping("/{id}")
    public ApiResponse<?> getClinic(@PathVariable Integer id) {
        Clinic clinic = clinicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Clinic not found"));
        return ApiResponse.success("Get clinic", clinic);
    }

    // Thêm cơ sở y tế
    @PostMapping
    public ApiResponse<?> createClinic(@RequestBody ClinicRequest req) {
        Clinic clinic = new Clinic();
        clinic.setName(req.getName());
        clinic.setAddress(req.getAddress());
        clinic.setHotline(req.getHotline());
        clinicRepository.save(clinic);
        clinic.setImage(req.getImage());


        return ApiResponse.success("Clinic created", clinic);
    }

    // Cập nhật
    @PutMapping("/{id}/image")
    public ApiResponse<?> updateClinicImage(
            @PathVariable Integer id,
            @RequestBody ClinicRequest req
    ) {
        Clinic clinic = clinicRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Clinic not found"));

        clinic.setImage(req.getImage());   // chỉ cập nhật ảnh
        clinicRepository.save(clinic);

        return ApiResponse.success("Clinic image updated", clinic);
    }

    // Xoá
    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteClinic(@PathVariable Integer id) {
        if (!clinicRepository.existsById(id))
            throw new RuntimeException("Clinic not found");

        clinicRepository.deleteById(id);
        return ApiResponse.success("Clinic deleted", null);
    }
}
