package com.bookinghealthcare.backend.controller;

import com.bookinghealthcare.backend.entity.Doctor;
import com.bookinghealthcare.backend.entity.ScheduleDay;
import com.bookinghealthcare.backend.entity.ScheduleSlot;
import com.bookinghealthcare.backend.dto.ScheduleDayRequest;
import com.bookinghealthcare.backend.dto.ScheduleSlotRequest;
import com.bookinghealthcare.backend.repository.DoctorRepository;
import com.bookinghealthcare.backend.repository.ScheduleDayRepository;
import com.bookinghealthcare.backend.repository.ScheduleSlotRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
@CrossOrigin
public class ScheduleController {

    private final ScheduleDayRepository scheduleDayRepository;
    private final ScheduleSlotRepository scheduleSlotRepository;
    private final DoctorRepository doctorRepository;

    // -------------------- LẤY DỮ LIỆU --------------------

    // Lấy ngày khám theo bác sĩ
    @GetMapping("/doctor/{doctorId}")
    public List<ScheduleDay> getDaysByDoctor(@PathVariable Integer doctorId) {
        return scheduleDayRepository.findByDoctor_Id(doctorId);
    }

    // Lấy slot theo ngày khám
    @GetMapping("/day/{dayId}")
    public List<ScheduleSlot> getSlots(@PathVariable Integer dayId) {
        return scheduleSlotRepository.findByScheduleDay_Id(dayId);
    }

    // -------------------- THÊM DỮ LIỆU --------------------

    @PostMapping("/day")
        public ScheduleDay createDay(@RequestBody ScheduleDayRequest req) {

        Doctor doctor = doctorRepository.findById(req.getDoctorId())
            .orElseThrow(() -> new RuntimeException("Doctor not found"));

        ScheduleDay day = new ScheduleDay();
        day.setDoctor(doctor);
        day.setDay(LocalDate.parse(req.getDay()));

        return scheduleDayRepository.save(day);
    }

    @PostMapping("/slot")
        public ScheduleSlot createSlot(@RequestBody ScheduleSlotRequest req) {

        ScheduleDay scheduleDay = scheduleDayRepository.findById(req.getScheduleDayId())
            .orElseThrow(() -> new RuntimeException("Schedule Day not found"));

        ScheduleSlot slot = new ScheduleSlot();
        slot.setSlot(req.getSlot());
        slot.setScheduleDay(scheduleDay);

        return scheduleSlotRepository.save(slot);
    }

    
    // -------------------- XOÁ --------------------

    @DeleteMapping("/day/{id}")
    public String deleteDay(@PathVariable Integer id) {
        scheduleDayRepository.deleteById(id);
        return "Deleted day id = " + id;
    }

    @DeleteMapping("/slot/{id}")
    public String deleteSlot(@PathVariable Integer id) {
        scheduleSlotRepository.deleteById(id);
        return "Deleted slot id = " + id;
    }
}
