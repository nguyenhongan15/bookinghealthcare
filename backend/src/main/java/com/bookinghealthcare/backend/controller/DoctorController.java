package com.bookinghealthcare.backend.controller;

import com.bookinghealthcare.backend.common.ApiResponse;
import com.bookinghealthcare.backend.dto.DoctorRequest;
import com.bookinghealthcare.backend.entity.Clinic;
import com.bookinghealthcare.backend.entity.Doctor;
import com.bookinghealthcare.backend.entity.Speciality;
import com.bookinghealthcare.backend.repository.ClinicRepository;
import com.bookinghealthcare.backend.repository.DoctorRepository;
import com.bookinghealthcare.backend.repository.SpecialityRepository;

import com.bookinghealthcare.backend.service.EmailService;
import com.bookinghealthcare.backend.utils.UsernameUtils;


import com.bookinghealthcare.backend.auth.UserAccount;
import com.bookinghealthcare.backend.auth.UserAccountRepository;
import com.bookinghealthcare.backend.auth.Role;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@CrossOrigin
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final SpecialityRepository specialityRepository;
    private final ClinicRepository clinicRepository;

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;


    // 🔵 GET: Lấy tất cả bác sĩ
    @GetMapping
    public ApiResponse<?> getAllDoctors() {
        List<Doctor> list = doctorRepository.findAll();
        return ApiResponse.success("Get all doctors", list);
    }

    // 🔵 GET: Lấy bác sĩ theo ID
    @GetMapping("/{id}")
    public ApiResponse<?> getDoctor(@PathVariable Integer id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return ApiResponse.success("Get doctor", doctor);
    }

    // 🟢 POST: Thêm bác sĩ mới
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
        doctor.setClinic(clinic);

        doctorRepository.save(doctor);

        String username = UsernameUtils.toUsername(req.getName());
        String rawPassword = UsernameUtils.toUsername(req.getName()) + "123";

        UserAccount account = UserAccount.builder()
            .username(username)
            .password(passwordEncoder.encode(rawPassword))
            .fullName(req.getName())
            .role(Role.DOCTOR)
            .doctorId(doctor.getId())
            .createdAt(LocalDateTime.now())
            .build();

        userAccountRepository.save(account);

        // lưu username vào bảng doctor
        doctor.setLoginUsername(username);
        doctorRepository.save(doctor);

        if (req.getEmail() != null && !req.getEmail().isEmpty()) {
            emailService.sendDoctorAccountEmail(
                    req.getEmail(),
                    req.getName(),
                    username,
                    rawPassword
            ); 
        }
        

        return ApiResponse.success("Doctor created", doctor);
    }

    @GetMapping("/clinic/{clinicId}")
    public ApiResponse<?> getDoctorsByClinic(@PathVariable Integer clinicId) {
        List<Doctor> list = doctorRepository.findByClinic_Id(clinicId);
        return ApiResponse.success("Doctors by clinic", list);
    }

    // 🟡 PUT: Cập nhật bác sĩ
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
    
    @GetMapping("/speciality/{specialityId}")
    public ApiResponse<?> getDoctorsBySpeciality(@PathVariable Integer specialityId) {
        List<Doctor> doctors = doctorRepository.findBySpeciality_Id(specialityId);
        return ApiResponse.success("Doctors by speciality", doctors);
    }
}
