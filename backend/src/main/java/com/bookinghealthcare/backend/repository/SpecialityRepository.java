package com.bookinghealthcare.backend.repository;

import com.bookinghealthcare.backend.entity.Speciality;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SpecialityRepository extends JpaRepository<Speciality, Integer> {
    Speciality findByCode(String code);
    List<Speciality> findByTitleIn(List<String> titles);
}
