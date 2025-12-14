package com.bookinghealthcare.backend.service;

// ===== Spring =====
import org.springframework.stereotype.Service;

// ===== Lombok =====
import lombok.RequiredArgsConstructor;

// ===== Repository =====
import com.bookinghealthcare.backend.repository.HealthProfileRepository;
import com.bookinghealthcare.backend.auth.UserAccountRepository;

// ===== Entity =====
import com.bookinghealthcare.backend.entity.HealthProfile;
import com.bookinghealthcare.backend.auth.UserAccount;

// ===== DTO =====
import com.bookinghealthcare.backend.dto.HealthProfileRequest;

@Service
@RequiredArgsConstructor
public class HealthProfileService {

    private final HealthProfileRepository repo;
    private final UserAccountRepository userRepo;

    public HealthProfile getOrCreate(Long userId) {
        return repo.findByUserId(userId)
                .orElseGet(() -> {
                    UserAccount user = userRepo.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));

                    HealthProfile profile = HealthProfile.builder()
                            .user(user)
                            .shareWithDoctor(false)
                            .build();

                    return repo.save(profile);
                });
    }

    public HealthProfile update(Long userId, HealthProfileRequest req) {
        HealthProfile profile = getOrCreate(userId);

        profile.setMedicalHistory(req.getMedicalHistory());
        profile.setAllergies(req.getAllergies());
        profile.setCurrentMedications(req.getCurrentMedications());
        profile.setShareWithDoctor(req.isShareWithDoctor());

        return repo.save(profile);
    }
}
