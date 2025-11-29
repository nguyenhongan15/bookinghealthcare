package com.bookinghealthcare.backend.repository;

import com.bookinghealthcare.backend.entity.ScheduleSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface ScheduleSlotRepository extends JpaRepository<ScheduleSlot, Integer> {
    List<ScheduleSlot> findByScheduleDay_Id(Integer scheduleDayId);
}
