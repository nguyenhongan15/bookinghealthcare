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

    // 1. Tạo booking mới
    @PostMapping
    public ApiResponse<?> createBooking(@RequestBody BookingRequest req) {

        if (req.getDoctorId() == null || req.getScheduleSlotId() == null) {
            throw new RuntimeException("DoctorId và scheduleSlotId không được null");
        }

        // Lấy doctor
        Doctor doctor = doctorRepository.findById(req.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Lấy slot
        ScheduleSlot slot = scheduleSlotRepository.findById(req.getScheduleSlotId())
                .orElseThrow(() -> new RuntimeException("Schedule slot not found"));

        // Kiểm tra slot đã có booking PENDING/CONFIRMED chưa
        boolean taken = bookingRepository.existsByScheduleSlot_IdAndStatusIn(
                req.getScheduleSlotId(),
                Arrays.asList(BookingStatus.PENDING, BookingStatus.CONFIRMED)
        );
        if (taken) {
            throw new RuntimeException("Khung giờ này đã có người đặt rồi");
        }

        UserAccount account;

        if (req.getUserAccountId() != null) {
        // 🟢 User đã đăng nhập -> lấy user cũ
        account = userAccountService.getById(req.getUserAccountId());
        } else {
        // 🔵 User chưa đăng nhập -> tạo tài khoản mới
            account = userAccountService.createUserAccountWhenGuestBooking(
                req.getPatientName(),
                req.getEmail(),
                req.getPatientPhone()
            );
        }

        // Lưu booking
        Booking booking = new Booking();
        booking.setPatientName(req.getPatientName());
        booking.setPatientPhone(req.getPatientPhone());
        booking.setNote(req.getNote());
        booking.setEmail(req.getEmail());
        booking.setDoctor(doctor);
        booking.setScheduleSlot(slot);
        booking.setStatus(BookingStatus.PENDING);
        booking.setDate(LocalDate.parse(req.getDate()));
        
        booking.setUserAccountId(account.getId());
        bookingRepository.save(booking);

        // NẾU SAI QUÁ THÌ BỎ ==================================================================================
        String bookingEmail = req.getEmail();      // email trong form đặt lịch
        boolean needAccountEmail = false;          // có cần gửi email tạo tài khoản không

        // 1 ƯU TIÊN CẬP NHẬT EMAIL VÀ GỬI MAIL TẠO TK NẾU USER TRƯỚC GIỜ CHƯA CÓ EMAIL
        if (bookingEmail != null && !bookingEmail.isBlank()) {

            if (account.getEmail() == null || account.getEmail().isBlank()) {
                // Trước đây user chưa có email -> cập nhật email từ booking
                account.setEmail(bookingEmail);

                if (!account.isWelcomeEmailSent()) {
                    needAccountEmail = true;   // sẽ gửi mail tạo tài khoản
                }
            } else {
                // User đã có email sẵn từ trước
                bookingEmail = account.getEmail(); // dùng email account cho đồng nhất
            }
        } else {
            // Nếu form booking KHÔNG gửi email nhưng account đã có email từ trước
            if (account.getEmail() != null && !account.getEmail().isBlank()) {
                bookingEmail = account.getEmail();
            }
        }
        // 2️ GỬI EMAIL TẠO TÀI KHOẢN (chỉ 1 lần duy nhất)
        if (bookingEmail != null && !bookingEmail.isBlank() && needAccountEmail) {
            try {
                emailService.sendUserAccountEmail(
                        bookingEmail,
                        req.getPatientName(),
                        account.getUsername(),
                        req.getPatientPhone()
                );
                account.setWelcomeEmailSent(true);
                userAccountService.save(account); // nhớ có hàm save hoặc update trong UserAccountService
            } catch (Exception e) {
                System.out.println("⚠ Không gửi được email tạo tài khoản khi booking: " + e.getMessage());
            }
        }
        // 3️ GỬI PHIẾU KHÁM BỆNH (nếu có email để gửi)
        if (bookingEmail != null && !bookingEmail.isBlank()) {
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
        }


        // // GỬI EMAIL XÁC NHẬN ============================ NẾU SAI QUA THÌ LẤY LẠI ĐOẠN NÀY
        // if (req.getEmail() != null && !req.getEmail().isEmpty()) {
        //     emailService.sendBookingEmail(
        //             req.getEmail(),                  
        //             req.getPatientName(), 
        //             req.getGender(),
        //             String.valueOf(req.getBirthyear()),
        //             req.getPatientPhone(),
        //             doctor.getName(),                  
        //             req.getDate(),
        //             slot.getSlot(),
        //             doctor.getClinic().getName(),
        //             doctor.getClinic().getAddress()              
        //     );
        // }

        // if (req.getUserAccountId() == null) {
        //     emailService.sendUserAccountEmail(
        //         req.getEmail(),
        //         req.getPatientName(),
        //         account.getUsername(),
        //         req.getPatientPhone()
        //     );
        // }
        
        return ApiResponse.success("Booking created", booking);
    }

    // =========================
    // 2. Lấy tất cả booking
    // =========================
    @GetMapping
    public ApiResponse<?> getAll() {
        List<Booking> list = bookingRepository.findAll();
        return ApiResponse.success("All bookings", list);
    }

    // =========================
    // 3. Lấy booking theo id
    // =========================
    @GetMapping("/{id}")
    public ApiResponse<?> getById(@PathVariable Integer id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return ApiResponse.success("Booking detail", booking);
    }

    // =========================
    // 4. Lịch sử đặt lịch theo sđt
    // =========================
    @GetMapping("/patient")
    public ApiResponse<?> getByPatientPhone(@RequestParam("phone") String phone) {
        List<Booking> list = bookingRepository.findByPatientPhoneOrderByCreatedAtDesc(phone);
        return ApiResponse.success("Booking history by phone", list);
    }



    // =========================
    // 5. Lịch theo bác sĩ
    // =========================
    @GetMapping("/doctor/{doctorId}")
    public ApiResponse<?> getByDoctor(@PathVariable Integer doctorId) {
        List<Booking> list = bookingRepository.findByDoctor_IdOrderByCreatedAtDesc(doctorId);
        return ApiResponse.success("Bookings of doctor", list);
    }

    // =========================
    // 6. Đổi trạng thái booking
    // =========================
    @PutMapping("/{id}/status")
    public ApiResponse<?> updateStatus(@PathVariable Integer id,
                                       @RequestBody BookingStatusRequest req) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(req.getStatus());
        bookingRepository.save(booking);

        return ApiResponse.success("Booking status updated", booking);
    }

    // =========================
    // 7. Xoá booking
    // =========================
    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable Integer id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found");
        }
        bookingRepository.deleteById(id);
        return ApiResponse.success("Booking deleted", null);
    }

    // =========================
    // 8. Lấy các slot đã đặt trong tuần hiện tại
    // =========================
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
