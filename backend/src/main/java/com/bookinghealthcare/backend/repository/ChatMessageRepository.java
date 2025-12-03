package com.bookinghealthcare.backend.repository;

import com.bookinghealthcare.backend.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByDoctorIdAndUserIdOrderByCreatedAt(Long doctorId, Long userId);

    // THÊM VÀO
    // Lấy danh sách bác sĩ mà user đã từng chat
    @Query("SELECT DISTINCT c.doctorId FROM ChatMessage c WHERE c.userId = :userId")
    List<Long> findDistinctDoctorByUserId(@Param("userId") Long userId);

    // Lấy danh sách user mà bác sĩ đã từng chat
    @Query("SELECT DISTINCT c.userId FROM ChatMessage c WHERE c.doctorId = :doctorId")
    List<Long> findDistinctUserByDoctorId(@Param("doctorId") Long doctorId);
}
