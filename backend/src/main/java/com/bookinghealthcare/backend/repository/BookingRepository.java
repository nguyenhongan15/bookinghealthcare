package com.bookinghealthcare.backend.repository;

import com.bookinghealthcare.backend.entity.Booking;
import com.bookinghealthcare.backend.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

    // Lịch sử đặt lịch theo số điện thoại
    List<Booking> findByPatientPhoneOrderByCreatedAtDesc(String phone);

    // Lịch theo bác sĩ
    List<Booking> findByDoctor_IdOrderByCreatedAtDesc(Integer doctorId);

    boolean existsByDoctor_IdAndUserAccountId(Integer doctorId, Long userAccountId);

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

    List<Booking> findByUserAccountIdOrderByCreatedAtDesc(Long userAccountId);

    @Query("""
    select b from Booking b
    where b.status = com.bookinghealthcare.backend.entity.BookingStatus.PENDING
      and (b.reminderSent = false or b.reminderSent is null)
      and b.appointmentAt between :from and :to
    """)
    List<Booking> findNeedReminder(
        @Param("from") LocalDateTime from,
        @Param("to") LocalDateTime to
    );
}
