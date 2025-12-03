package com.bookinghealthcare.backend.controller;

import com.bookinghealthcare.backend.common.ApiResponse;
import com.bookinghealthcare.backend.dto.ChatPartnerDto;
import com.bookinghealthcare.backend.entity.ChatMessage;
import com.bookinghealthcare.backend.repository.BookingRepository;
import com.bookinghealthcare.backend.repository.ChatMessageRepository;
import com.bookinghealthcare.backend.repository.DoctorRepository;
import com.bookinghealthcare.backend.auth.UserAccountRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessageRepository repo;
    private final DoctorRepository doctorRepository;
    private final UserAccountRepository userRepository;
    private final BookingRepository bookingRepository;

    // -------------------- LỊCH SỬ TIN NHẮN --------------------
    @GetMapping("/history")
    public ApiResponse<List<ChatMessage>> getHistory(
            @RequestParam Long doctorId,
            @RequestParam Long userId
    ) {
        List<ChatMessage> msgs =
                repo.findByDoctorIdAndUserIdOrderByCreatedAt(doctorId, userId);

        return ApiResponse.success(msgs);
    }

    // -------------------- GỬI TIN NHẮN --------------------
    @PostMapping("/send")
    public ApiResponse<ChatMessage> send(@RequestBody ChatMessage msg) {
        msg.setCreatedAt(LocalDateTime.now());
        ChatMessage saved = repo.save(msg);
        return ApiResponse.success(saved);
    }

    // -------------------- DANH SÁCH BÁC SĨ MÀ USER ĐÃ CHAT --------------------
    @GetMapping("/partners/user/{userId}")
    public ApiResponse<List<ChatPartnerDto>> getDoctorsOfUser(@PathVariable Long userId) {

        List<Long> doctorIds = repo.findDistinctDoctorByUserId(userId);

        List<ChatPartnerDto> result = doctorIds.stream().map(id -> {
            var doc = doctorRepository.findById(id.intValue()).orElse(null);
            boolean booked = bookingRepository
                        .existsByDoctor_IdAndUserAccountId(id.intValue(), userId);

            return ChatPartnerDto.builder()
                    .id(id)
                    .name(doc != null ? doc.getName() : "Bác sĩ")
                    .image(doc != null ? doc.getImage() : null)
                    .booked(booked)
                    .build();
        }).toList();

        return ApiResponse.success(result);
    }

    // -------------------- DANH SÁCH USER ĐÃ CHAT VỚI BÁC SĨ --------------------
    @GetMapping("/partners/doctor/{doctorId}")
    public ApiResponse<List<ChatPartnerDto>> getUsersOfDoctor(@PathVariable Long doctorId) {

        List<Long> userIds = repo.findDistinctUserByDoctorId(doctorId);

        List<ChatPartnerDto> result = userIds.stream().map(id -> {
            var user = userRepository.findById(id).orElse(null);
            boolean booked = bookingRepository
                        .existsByDoctor_IdAndUserAccountId(doctorId.intValue(), id);


            return ChatPartnerDto.builder()
                    .id(id)
                    .name(user != null ? user.getFullName() : "Người dùng")
                    .image(null) // user chưa có avatar
                    .booked(booked)
                    .build();
        }).toList();

        return ApiResponse.success(result);
    }
}
