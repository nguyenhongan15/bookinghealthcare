package com.bookinghealthcare.backend.controller;

import com.bookinghealthcare.backend.common.ApiResponse;
import com.bookinghealthcare.backend.dto.DoctorRequest;
import com.bookinghealthcare.backend.entity.Clinic;
import com.bookinghealthcare.backend.entity.Doctor;
import com.bookinghealthcare.backend.entity.Speciality;
import com.bookinghealthcare.backend.repository.ClinicRepository;
import com.bookinghealthcare.backend.repository.DoctorRepository;
import com.bookinghealthcare.backend.repository.SpecialityRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@CrossOrigin
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final SpecialityRepository specialityRepository;
    private final ClinicRepository clinicRepository;

    // ==============================
    // 🔵 GET: Lấy tất cả bác sĩ
    // ==============================
    @GetMapping
    public ApiResponse<?> getAllDoctors() {
        List<Doctor> list = doctorRepository.findAll();
        return ApiResponse.success("Get all doctors", list);
    }

    // ==============================
    // 🔵 GET: Lấy bác sĩ theo ID
    // ==============================
    @GetMapping("/{id}")
    public ApiResponse<?> getDoctor(@PathVariable Integer id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return ApiResponse.success("Get doctor", doctor);
    }

    // ==============================
    // 🟢 POST: Thêm bác sĩ mới
    // ==============================
    @PostMapping
    public ApiResponse<?> createDoctor(@RequestBody DoctorRequest req) {

        Speciality speciality = specialityRepository.findById(req.getSpecialityId())
                .orElseThrow(() -> new RuntimeException("Speciality not found"));
        
        Clinic clinic = clinicRepository.findById(req.getClinicId())
        .orElseThrow(() -> new RuntimeException("Clinic not found"));

        Doctor doctor = new Doctor();
        doctor.setName(req.getName());
        doctor.setImage(req.getImage());
        doctor.setDescription(req.getDescription());
        doctor.setExpertise(req.getExpertise());
        doctor.setLocation(req.getLocation());
        doctor.setSpeciality(speciality);

        doctorRepository.save(doctor);
        doctor.setClinic(clinic);

        return ApiResponse.success("Doctor created", doctor);
    }

    // ==============================
    // 🟡 PUT: Cập nhật bác sĩ
    // ==============================
    @PutMapping("/{id}")
    public ApiResponse<?> updateDoctor(@PathVariable Integer id, @RequestBody DoctorRequest req) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Speciality speciality = specialityRepository.findById(req.getSpecialityId())
                .orElseThrow(() -> new RuntimeException("Speciality not found"));

        Clinic clinic = clinicRepository.findById(req.getClinicId())
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        doctor.setName(req.getName());
        doctor.setImage(req.getImage());
        doctor.setDescription(req.getDescription());
        doctor.setExpertise(req.getExpertise());
        doctor.setLocation(req.getLocation());
        doctor.setSpeciality(speciality);
        doctor.setClinic(clinic);

        doctorRepository.save(doctor);

        return ApiResponse.success("Doctor updated", doctor);
    }


    // 🔴 DELETE: Xoá bác sĩ
    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteDoctor(@PathVariable Integer id) {

        if (!doctorRepository.existsById(id)) {
            throw new RuntimeException("Doctor not found");
        }

        doctorRepository.deleteById(id);

        return ApiResponse.success("Doctor deleted", null);
    }

    // lọc bác sĩ
    @GetMapping("/filter")
    public ApiResponse<?> filterDoctors(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer clinicId,
            @RequestParam(required = false) Integer specialityId
    ) {
        List<Doctor> doctors = doctorRepository.filterDoctors(location, clinicId, specialityId);
        return ApiResponse.success("Filtered doctors", doctors);
}
}
