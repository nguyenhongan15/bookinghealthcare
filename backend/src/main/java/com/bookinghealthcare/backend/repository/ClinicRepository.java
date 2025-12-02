package com.bookinghealthcare.backend.repository;

import com.bookinghealthcare.backend.entity.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClinicRepository extends JpaRepository<Clinic, Integer> {
    Clinic findByNameAndAddress(String name, String address);

 }
