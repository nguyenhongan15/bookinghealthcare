package com.bookinghealthcare.backend.repository;

import com.bookinghealthcare.backend.entity.ScheduleDay;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;


public interface ScheduleDayRepository extends JpaRepository<ScheduleDay, Integer> {
    List<ScheduleDay> findByDoctor_Id(Integer doctorId);
    ScheduleDay findByDoctor_IdAndDay(Integer doctorId, String day);

}
