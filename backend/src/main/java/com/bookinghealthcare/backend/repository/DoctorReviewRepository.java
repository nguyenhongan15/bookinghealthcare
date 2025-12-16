package com.bookinghealthcare.backend.repository;

import com.bookinghealthcare.backend.entity.DoctorReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorReviewRepository extends JpaRepository<DoctorReview, Long> {

    boolean existsByBookingId(Integer bookingId);

    List<DoctorReview> findByDoctorId(Long doctorId);
}
