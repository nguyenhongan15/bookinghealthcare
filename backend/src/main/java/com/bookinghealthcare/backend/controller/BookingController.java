package com.bookinghealthcare.backend.controller;

import com.bookinghealthcare.backend.common.ApiResponse;
import com.bookinghealthcare.backend.dto.BookingRequest;
import com.bookinghealthcare.backend.dto.BookingStatusRequest;
import com.bookinghealthcare.backend.entity.*;
import com.bookinghealthcare.backend.repository.*;
import com.bookinghealthcare.backend.service.EmailService;
import com.bookinghealthcare.backend.auth.UserAccount;
import com.bookinghealthcare.backend.auth.UserAccountService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin
public class BookingController {

    private final BookingRepository bookingRepository;
    private final DoctorRepository doctorRepository;
    private final ScheduleSlotRepository scheduleSlotRepository;
    private final EmailService emailService; 

    private final UserAccountService userAccountService;

    @PostMapping
    public ApiResponse<?> createBooking(@RequestBody BookingRequest req) {

        if (req.getDoctorId() == null || req.getScheduleSlotId() == null) {
            throw new RuntimeException("DoctorId và scheduleSlotId không được null");
        }

        Doctor doctor = doctorRepository.findById(req.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        ScheduleSlot slot = scheduleSlotRepository.findById(req.getScheduleSlotId())
                .orElseThrow(() -> new RuntimeException("Schedule slot not found"));

        boolean taken = bookingRepository.existsByScheduleSlot_IdAndStatusIn(
                req.getScheduleSlotId(),
                Arrays.asList(BookingStatus.PENDING, BookingStatus.CONFIRMED)
        );
        if (taken) {
            throw new RuntimeException("Khung giờ này đã có người đặt rồi");
        }

        UserAccount account;

        if (req.getUserAccountId() != null) {
            account = userAccountService.getById(req.getUserAccountId());
        } else {
            account = userAccountService.findByPhone(req.getPatientPhone());
        
            if (account == null) {
                account = userAccountService.createUserAccountWhenGuestBooking(
                    req.getPatientName(),
                    null,                 // ❗ KHÔNG BAO GIỜ set email ở booking
                    req.getPatientPhone()
                );
            }
        }
        

        if (account == null) {
            account = userAccountService.createUserAccountWhenGuestBooking(
                req.getPatientName(),
                null,                  // ❗ email = null
                req.getPatientPhone()
            );
        }
 

        Booking booking = new Booking();
        booking.setUserAccountId(account.getId());
        booking.setPatientName(req.getPatientName());
        booking.setPatientPhone(req.getPatientPhone());
        booking.setNote(req.getNote());
        booking.setEmail(req.getEmail());
        booking.setDoctor(doctor);
        booking.setScheduleSlot(slot);
        booking.setStatus(BookingStatus.PENDING);
        booking.setDate(LocalDate.parse(req.getDate()));
        booking.setPrice(500000);
        booking.setUserAccountId(account.getId());

        String slotTime = slot.getSlot().split("-")[0].trim();

        LocalDate date = LocalDate.parse(req.getDate());
        LocalTime time = LocalTime.parse(slotTime);

        booking.setAppointmentAt(LocalDateTime.of(date, time));
        booking.setReminderSent(false);

        bookingRepository.save(booking);

        String bookingEmail = req.getEmail();
        String accountEmail = account.getEmail(); 
        boolean needWelcomeEmail = false;

        if (accountEmail != null && !accountEmail.isBlank()) {
            if (!account.isWelcomeEmailSent()) {
                needWelcomeEmail = true;
            }
        }
        

        if (needWelcomeEmail && account.getEmail() != null && !account.getEmail().isBlank()) {
            try {
                emailService.sendUserAccountEmail(
                        account.getEmail(),
                        req.getPatientName(),
                        account.getUsername(),
                        req.getPatientPhone()
                );
        
                account.setWelcomeEmailSent(true);
                userAccountService.save(account);
            } catch (Exception e) {
                System.out.println("⚠ Welcome email failed: " + e.getMessage());
            }
        }

        if (bookingEmail != null && !bookingEmail.isBlank()) {
            try {
                emailService.sendBookingEmail(
                        bookingEmail,
                        req.getPatientName(),
                        req.getGender(),
                        String.valueOf(req.getBirthyear()),
                        req.getPatientPhone(),
                        doctor.getName(),
                        req.getDate(),
                        slot.getSlot(),
                        doctor.getClinic().getName(),
                        doctor.getClinic().getAddress()
                );
            } catch (Exception e) {
                System.out.println("⚠ Booking email failed: " + e.getMessage());
            }
        }
        
        return ApiResponse.success("Booking created", booking);
    }

    @GetMapping
    public ApiResponse<?> getAll() {
        List<Booking> list = bookingRepository.findAll();
        return ApiResponse.success("All bookings", list);
    }

    @GetMapping("/{id}")
    public ApiResponse<?> getById(@PathVariable Integer id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return ApiResponse.success("Booking detail", booking);
    }

    @GetMapping("/patient")
    public ApiResponse<?> getByPatientPhone(@RequestParam("phone") String phone) {
        List<Booking> list = bookingRepository.findByPatientPhoneOrderByCreatedAtDesc(phone);
        return ApiResponse.success("Booking history by phone", list);
    }
    @GetMapping("/user/{userId}")
    public ApiResponse<?> getByUser(@PathVariable Long userId) {

        List<Booking> list =
            bookingRepository.findByUserAccountIdOrderByCreatedAtDesc(userId);

        return ApiResponse.success("Booking by user", list);
    }


    @GetMapping("/doctor/{doctorId}")
    public ApiResponse<?> getByDoctor(@PathVariable Integer doctorId) {
        List<Booking> list = bookingRepository.findByDoctor_IdOrderByCreatedAtDesc(doctorId);
        return ApiResponse.success("Bookings of doctor", list);
    }

    @GetMapping("/doctor-schedule")
    public ApiResponse<?> getDoctorSchedule(@RequestParam Integer doctorId) {

        List<Booking> bookings =
                bookingRepository.findByDoctor_IdOrderByCreatedAtDesc(doctorId);

        List<Map<String, Object>> result = bookings.stream().map(b -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", b.getId());
            m.put("date", b.getDate());
            m.put("time", b.getScheduleSlot().getSlot());
            m.put("patientName", b.getPatientName());
            m.put("patientPhone", b.getPatientPhone());
            m.put("status", b.getStatus());
            m.put("userId", b.getUserAccountId());
            return m;
        }).toList();

        return ApiResponse.success("Doctor schedule", result);
    }


    @PutMapping("/{id}/status")
    public ApiResponse<?> updateStatus(@PathVariable Integer id,
                                       @RequestBody BookingStatusRequest req) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(req.getStatus());
        bookingRepository.save(booking);

        return ApiResponse.success("Booking status updated", booking);
    }

    // @DeleteMapping("/{id}")
    // public ApiResponse<?> delete(@PathVariable Integer id) {
    //     if (!bookingRepository.existsById(id)) {
    //         throw new RuntimeException("Booking not found");
    //     }
    //     bookingRepository.deleteById(id);
    //     return ApiResponse.success("Booking deleted", null);
    // }
    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable Integer id) {

        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime appt = booking.getAppointmentAt();

        long minutesLeft = java.time.Duration.between(now, appt).toMinutes();

        if (minutesLeft < 120) {
            throw new RuntimeException("Không thể huỷ lịch khi còn dưới 2 giờ");
        }

        bookingRepository.delete(booking);
        return ApiResponse.success("Booking deleted", null);
    }


    @GetMapping("/booked-slots")
        public ApiResponse<?> getBookedSlots(
            @RequestParam Integer doctorId,
            @RequestParam String date
        ) {
        LocalDate realDate = LocalDate.parse(date);

        List<Booking> list = bookingRepository.findByDoctor_IdAndDateAndStatusIn(
            doctorId,
            realDate,
            Arrays.asList(BookingStatus.PENDING, BookingStatus.CONFIRMED)
        );

        List<Integer> slotIds = list.stream()
                .map(b -> b.getScheduleSlot().getId())
                .toList();

        return ApiResponse.success("Booked slots", slotIds);
    }
}
