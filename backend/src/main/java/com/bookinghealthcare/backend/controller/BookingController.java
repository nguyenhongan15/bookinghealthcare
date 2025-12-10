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
        }
        else {
            account = userAccountService.findByPhoneOrEmail(req.getPatientPhone(), req.getEmail());
            if (account == null) {
                account = userAccountService.createUserAccountWhenGuestBooking(
                        req.getPatientName(),
                        req.getEmail(),
                        req.getPatientPhone()
                );
            }
        }   

        Booking booking = new Booking();
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
        bookingRepository.save(booking);


        String bookingEmail = req.getEmail();
        String accountEmail = account.getEmail(); 
        boolean needWelcomeEmail = false;

        if (accountEmail != null && !accountEmail.isBlank()) {
            if (!account.isWelcomeEmailSent()) {
                needWelcomeEmail = true;
            }
        }
        else {
            if (bookingEmail != null && !bookingEmail.isBlank()) {
                account.setEmail(bookingEmail);
                if (!account.isWelcomeEmailSent()) {
                    needWelcomeEmail = true;
                }
            }
        }
        // ========== Gửi email tạo tài khoản nếu cần ==========
        if (needWelcomeEmail) {
            try {
                emailService.sendUserAccountEmail(
                        account.getEmail(),        // gửi về email tài khoản
                        req.getPatientName(),
                        account.getUsername(),
                        req.getPatientPhone()
                );

                account.setWelcomeEmailSent(true);
                userAccountService.save(account);

            } catch (Exception e) {
                System.out.println("⚠ Không gửi được email tạo tài khoản: " + e.getMessage());
            }
        }
         // ========== Gửi phiếu khám ==========
         if (bookingEmail != null && !bookingEmail.isBlank()) {
            emailService.sendBookingEmail(
                    bookingEmail,                  // gửi về email user nhập khi đặt lịch
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

    @GetMapping("/doctor/{doctorId}")
    public ApiResponse<?> getByDoctor(@PathVariable Integer doctorId) {
        List<Booking> list = bookingRepository.findByDoctor_IdOrderByCreatedAtDesc(doctorId);
        return ApiResponse.success("Bookings of doctor", list);
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

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable Integer id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found");
        }
        bookingRepository.deleteById(id);
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
