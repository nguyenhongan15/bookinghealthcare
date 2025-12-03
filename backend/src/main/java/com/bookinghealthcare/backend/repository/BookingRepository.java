package com.bookinghealthcare.backend.repository;

import com.bookinghealthcare.backend.entity.Booking;
import com.bookinghealthcare.backend.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

    // Lịch sử đặt lịch theo số điện thoại
    List<Booking> findByPatientPhoneOrderByCreatedAtDesc(String phone);

    // Lịch theo bác sĩ
    List<Booking> findByDoctor_IdOrderByCreatedAtDesc(Integer doctorId);

    // Kiểm tra 1 slot có bị đặt rồi chưa (còn hiệu lực)
    boolean existsByScheduleSlot_IdAndStatusIn(
            Integer scheduleSlotId,
            List<BookingStatus> status
    );

    List<Booking> findByDoctor_IdAndDateAndStatusIn(
        Integer doctorId,
        LocalDate date,
        List<BookingStatus> statuses
    );
    boolean existsByDoctor_IdAndUserAccountId(Integer doctorId, Long userAccountId);

}
