package com.bookinghealthcare.backend.config;

import com.bookinghealthcare.backend.entity.Clinic;
import com.bookinghealthcare.backend.entity.Doctor;
import com.bookinghealthcare.backend.entity.ScheduleDay;
import com.bookinghealthcare.backend.entity.ScheduleSlot;
import com.bookinghealthcare.backend.entity.Speciality;
import com.bookinghealthcare.backend.repository.ClinicRepository;
import com.bookinghealthcare.backend.repository.DoctorRepository;
import com.bookinghealthcare.backend.repository.ScheduleDayRepository;
import com.bookinghealthcare.backend.repository.ScheduleSlotRepository;
import com.bookinghealthcare.backend.repository.SpecialityRepository;
import com.bookinghealthcare.backend.utils.ExcelImporter;
import jakarta.annotation.PostConstruct;

import com.bookinghealthcare.backend.auth.UserAccount;
import com.bookinghealthcare.backend.auth.UserAccountRepository;
import com.bookinghealthcare.backend.auth.DoctorSimple;
import com.bookinghealthcare.backend.auth.DoctorSimpleRepository;
import com.bookinghealthcare.backend.auth.Role;
import com.bookinghealthcare.backend.utils.UsernameUtils;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor


public class DataLoader {

    private final ClinicRepository clinicRepo;
    private final SpecialityRepository specialityRepo;
    private final DoctorRepository doctorRepo;
    private final ScheduleDayRepository scheduleDayRepo;
    private final ScheduleSlotRepository scheduleSlotRepo;

    private final UserAccountRepository userAccountRepo;
    private final PasswordEncoder passwordEncoder;

    private final DoctorSimpleRepository doctorSimpleRepo;

    private final UserAccountRepository userAccountRepository;
    private final DoctorRepository doctorRepository;

<<<<<<< Updated upstream
    @PostConstruct
=======
    //==============================================================

    //======================VỪA THÊM VÀO===================================
>>>>>>> Stashed changes
    private void linkDoctorsWithAccounts() {
        List<Doctor> doctors = doctorRepository.findAll();
    
        for (Doctor d : doctors) {
            if (d.getLoginUsername() == null) continue;
    
            userAccountRepository.findByUsername(d.getLoginUsername())
                .ifPresent(acc -> {
                    acc.setDoctorId(d.getId());
                    userAccountRepository.save(acc);
                    System.out.println("🔗 Linked doctor " 
                            + d.getName() + " → user " + acc.getUsername());
                });
        }
    }
<<<<<<< Updated upstream

=======
    //===================================================================
    @PostConstruct
>>>>>>> Stashed changes
    public void init() {
        System.out.println("========== DATA LOADER ==========");

        loadSpecialities();
        loadClinics();
        loadDoctors();
        loadDoctorSchedule();

        System.out.println("========== IMPORT DONE ==========");
    }


    private void loadSpecialities() {
        
        String path = "data/speciality/specialities.xlsx";
        List<List<String>> rows = ExcelImporter.readExcel(path);

        boolean skip = true;
        for (List<String> r : rows) {

            if (skip) { skip = false; continue; }

            if (r.size() < 3) {
                System.out.println("Dòng bị thiếu dữ liệu, skip: " + r);
                continue;
            }

            String code = r.get(0).trim();

            // Kiểm tra trùng
            Speciality exist = specialityRepo.findByCode(code);
            if (exist != null) {
                System.out.println("Speciality existed, skip: " + code);
                continue;
            }

            Speciality s = new Speciality();
            s.setCode(r.get(0));
            s.setTitle(r.get(1));
            s.setImage(r.get(2));

            specialityRepo.save(s);
        }

        System.out.println("Specialities imported");
    }

    private void loadClinics() {
        String path = "data/clinics/clinic_data.xlsx";
        List<List<String>> rows = ExcelImporter.readExcel(path);

        boolean skip = true;
        for (List<String> r : rows) {

            if (skip) { skip = false; continue; }
            String name = r.get(0);
            String address = r.get(1);

            Clinic exist = clinicRepo.findByNameAndAddress(name, address);

            if (exist != null) {
                System.out.println("⏩ Clinic existed, skip: " + name);
                continue; // bỏ qua
            }

            Clinic c = new Clinic();
            c.setName(r.get(0));
            c.setAddress(r.get(1));
            c.setHotline(r.get(2));
            c.setImage(r.get(3));

            clinicRepo.save(c);
        }

        System.out.println(" Clinics imported");
    }

    private void loadDoctors() {

        String path = "data/doctors/doctors.xlsx";
        List<List<String>> rows = ExcelImporter.readExcel(path);

        boolean skip = true;
        for (List<String> r : rows) {

            if (skip) { skip = false; continue; }
            if (r.size() < 7) {
                System.out.println(" Dòng thiếu dữ liệu doctor, skip: " + r);
                continue;
            }

            String name = r.get(0).trim();
            Integer clinicId = Integer.valueOf(r.get(5));
            Integer specialityId = Integer.valueOf(r.get(6));

            Clinic clinic = clinicRepo.findById(clinicId).orElse(null);
            Speciality speciality = specialityRepo.findById(specialityId).orElse(null);

            if (clinic == null || speciality == null) {
                System.out.println(" Skip doctor: Clinic or Speciality not found for " + name);
                continue;
            }

            Doctor exist = doctorRepo.findByNameAndClinic_IdAndSpeciality_Id(
                name, clinicId, specialityId
            );

            if (exist != null) {
                System.out.println(" Doctor existed, skip: " + name);
                continue;
            }

            Doctor d = new Doctor();

            d.setName(r.get(0));
            d.setDescription(r.get(1));
            d.setExpertise(r.get(2));
            d.setLocation(r.get(3));
            d.setImage(r.get(4));

            String achievement = null;
            if (r.size() > 7 && r.get(7) != null && !r.get(7).trim().isEmpty()) {
                achievement = r.get(7).trim();
            }
            d.setAchievement(achievement);

            d.setClinic(clinic);
            d.setSpeciality(speciality);

            doctorRepo.save(d);

            String username = UsernameUtils.generateUniqueUsername(
                name,
                uname -> userAccountRepo.findByUsername(uname).isPresent()
            );
        
            d.setLoginUsername(username);
            doctorRepo.save(d);

            String passwordRaw = username + "123";

            UserAccount doctorAcc = UserAccount.builder()
                .username(username)
                .password(passwordEncoder.encode(passwordRaw))
                .role(Role.DOCTOR)
                .fullName(name)
                .doctorId(d.getId())
                .createdAt(LocalDateTime.now())
                .build();

            userAccountRepo.save(doctorAcc);

            DoctorSimple ds = DoctorSimple.builder()
                .id(doctorAcc.getId())
                .username(doctorAcc.getUsername())
                .fullName(doctorAcc.getFullName())
                .email(null)
                .doctorId(doctorAcc.getDoctorId())
                .createdAt(doctorAcc.getCreatedAt())
                .build();

            doctorSimpleRepo.save(ds);
        }
        System.out.println(" Doctors imported");
        linkDoctorsWithAccounts();

    }

    private void loadDoctorSchedule() {

        String path = "data/schedule/doctor_schedule.xlsx";
        List<List<String>> rows = ExcelImporter.readExcel(path);
    
        boolean skip = true;
    
        for (List<String> r : rows) {
    
            if (skip) { skip = false; continue; }
    
            Integer doctorId = Integer.valueOf(r.get(0));
            String day = r.get(1).trim();  
            
            day = day.replaceAll("\\s+", "");
            day = day.substring(0,1).toUpperCase() + day.substring(1).toLowerCase();
    
            String slot = r.get(2).trim();
    
            Doctor doctor = doctorRepo.findById(doctorId).orElse(null);
            if (doctor == null) continue;
    
            ScheduleDay scheduleDay = scheduleDayRepo.findByDoctor_IdAndDay(doctorId, day);
    
            if (scheduleDay == null) {
                scheduleDay = new ScheduleDay();
                scheduleDay.setDoctor(doctor);
                scheduleDay.setDay(day);
                scheduleDay = scheduleDayRepo.save(scheduleDay);
            }
    
            boolean exists = scheduleSlotRepo.existsByScheduleDay_IdAndSlot(scheduleDay.getId(), slot);
            if (exists) {
                System.out.println(" Slot existed, skip: " + day + " - " + slot);
                continue;
            }
    
            ScheduleSlot scheduleSlot = new ScheduleSlot();
            scheduleSlot.setScheduleDay(scheduleDay);
            scheduleSlot.setSlot(slot);
    
            scheduleSlotRepo.save(scheduleSlot);
        }
    
        System.out.println(" Schedule imported from Excel");
    }
}
