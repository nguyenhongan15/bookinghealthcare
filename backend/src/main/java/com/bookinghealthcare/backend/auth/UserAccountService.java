package com.bookinghealthcare.backend.auth;

import com.bookinghealthcare.backend.utils.UsernameUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserAccountService {

    private final UserAccountRepository repo;
    private final PasswordEncoder passwordEncoder;

    public UserAccount getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserAccount save(UserAccount account) {
        return repo.save(account);
    }

    public UserAccount createUserAccountWhenGuestBooking(String fullName,
                                                        String email,
                                                        String phone) {

        // username từ fullname
        String baseUsername = UsernameUtils.toUsername(fullName);
        String username = baseUsername;
        int suffix = 1;

        // nếu username trùng -> thêm số
        while (repo.existsByUsername(username)) {
                username = baseUsername + suffix;
                suffix++;
        }

        // password = số điện thoại
        String rawPass = phone;

        UserAccount account = UserAccount.builder()
                .username(username)
                .password(passwordEncoder.encode(rawPass))
                .email(null)
                .phone(phone)
                .fullName(fullName)
                .role(Role.USER)
                .createdAt(LocalDateTime.now())
                .welcomeEmailSent(false)
                .build();

        return repo.save(account);
    }
}
