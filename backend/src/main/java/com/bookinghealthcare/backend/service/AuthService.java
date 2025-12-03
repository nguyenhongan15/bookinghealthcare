package com.bookinghealthcare.backend.service;

import com.bookinghealthcare.backend.auth.UserAccount;
import com.bookinghealthcare.backend.auth.UserAccountRepository;
import com.bookinghealthcare.backend.dto.LoginRequest;
import com.bookinghealthcare.backend.dto.LoginResponse;
import com.bookinghealthcare.backend.dto.RegisterRequest;
import com.bookinghealthcare.backend.auth.Role;

import com.bookinghealthcare.backend.auth.UserSimple;
import com.bookinghealthcare.backend.auth.UserSimpleRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    private final UserSimpleRepository userSimpleRepository;

    private final EmailService emailService; // NẾU LỖI QUÁ THÌ BỎ

    public LoginResponse login(LoginRequest req) {

        UserAccount account = userAccountRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("Sai tên đăng nhập hoặc mật khẩu"));


        boolean match = passwordEncoder.matches(req.getPassword(), account.getPassword());
        if (!match) {
            throw new RuntimeException("Sai tên đăng nhập hoặc mật khẩu");
        }

        return LoginResponse.builder()
                .id(account.getId())
                .username(account.getUsername())
                .fullName(account.getFullName())
                .role(account.getRole().name())
                .doctorId(account.getDoctorId())  // nếu USER thì null
                .build();
    }

    public LoginResponse register(RegisterRequest req) {

        // check trùng username
        if (userAccountRepository.existsByUsername(req.getUsername())) {
            throw new RuntimeException("Username existed");
        }

        UserAccount acc = new UserAccount();
        acc.setUsername(req.getUsername());
        acc.setFullName(req.getFullName());
        acc.setPhone(req.getPhone());
        acc.setPassword(passwordEncoder.encode(req.getPassword()));
        acc.setRole(Role.USER);

        //  Email KHÔNG bắt buộc SAI QUÁ THÌ XOÁ
        if (req.getEmail() != null && !req.getEmail().isBlank()) {
            acc.setEmail(req.getEmail());
        } else {
            acc.setEmail(null);
        }
        acc.setWelcomeEmailSent(false);

        userAccountRepository.save(acc);

        userSimpleRepository.save(
            UserSimple.builder()
                .id(acc.getId())
                .username(acc.getUsername())
                .fullName(acc.getFullName())
                .phone(acc.getPhone())
                .createdAt(acc.getCreatedAt())
                .build()
        );

        // GỬI EMAIL TẠO TÀI KHOẢN (NẾU CÓ EMAIL)
        // ===========================
        if (acc.getEmail() != null && !acc.getEmail().isBlank()) {
            try {
                // dùng chung template với lúc book cho guest
                emailService.sendUserAccountEmail(
                        acc.getEmail(),
                        acc.getFullName(),
                        acc.getUsername(),
                        acc.getPhone()
                );

                acc.setWelcomeEmailSent(true);
                userAccountRepository.save(acc); // update flag

            } catch (Exception e) {
                System.out.println("⚠ Không gửi được email tạo tài khoản: " + e.getMessage());
            }
        }

        return LoginResponse.builder()
                .id(acc.getId())
                .username(acc.getUsername())
                .fullName(acc.getFullName())
                .role(acc.getRole().name())
                .doctorId(null)
                .build();
    }
    
    public boolean exists(String username) {
        return userAccountRepository.existsByUsername(username);
    }
}
