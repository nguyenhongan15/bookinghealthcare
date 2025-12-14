package com.bookinghealthcare.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bookinghealthcare.backend.entity.HealthProfile;

public interface HealthProfileRepository
        extends JpaRepository<HealthProfile, Long> {

    Optional<HealthProfile> findByUserId(Long userId);
}
