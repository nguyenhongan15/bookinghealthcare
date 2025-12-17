package com.bookinghealthcare.backend.auth;

import com.bookinghealthcare.backend.utils.UsernameUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;


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

    public UserAccount findByPhoneOrEmail(String phone, String email) {

        if (phone != null && !phone.isBlank()) {
            Optional<UserAccount> byPhone = repo.findByPhone(phone);
            if (byPhone.isPresent()) return byPhone.get();
        }
    
        if (email != null && !email.isBlank()) {
            Optional<UserAccount> byEmail = repo.findByEmail(email);
            if (byEmail.isPresent()) return byEmail.get();
        }
    
        return null;
    }
    public UserAccount findByPhone(String phone) {
        if (phone == null || phone.isBlank()) return null;
        return repo.findByPhone(phone).orElse(null);
    }
    
    

    public UserAccount createUserAccountWhenGuestBooking(String fullName,
                                                        String email,
                                                        String phone) {

        String baseUsername = UsernameUtils.toUsername(fullName);
        String username = baseUsername;
        int suffix = 1;

        while (repo.existsByUsername(username)) {
                username = baseUsername + suffix;
                suffix++;
        }

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
