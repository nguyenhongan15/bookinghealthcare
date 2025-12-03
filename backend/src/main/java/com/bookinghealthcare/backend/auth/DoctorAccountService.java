package com.bookinghealthcare.backend.auth;

import com.bookinghealthcare.backend.utils.UsernameUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DoctorAccountService {

    private final UserAccountRepository repo;
    private final PasswordEncoder encoder;

    private static final String CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private final SecureRandom random = new SecureRandom();

    private String randomPassword() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            sb.append(CHARSET.charAt(random.nextInt(CHARSET.length())));
        }
        return sb.toString();
    }

    public CreatedDoctorAccount createDoctorAccount(int doctorId, String doctorName) {

        String baseUsername = UsernameUtils.toUsername(doctorName);
        String username = baseUsername;
        int suffix = 1;

        while (repo.existsByUsername(username)) {
            username = baseUsername + suffix;
            suffix++;
        }

        String rawPass = randomPassword();

        UserAccount account = UserAccount.builder()
                .username(username)
                .password(encoder.encode(rawPass))
                .fullName(doctorName)
                .role(Role.DOCTOR)
                .doctorId(doctorId)
                .createdAt(LocalDateTime.now())
                .build();

        repo.save(account);

        return new CreatedDoctorAccount(username, rawPass);
    }

    public record CreatedDoctorAccount(String username, String rawPassword) {}
}
