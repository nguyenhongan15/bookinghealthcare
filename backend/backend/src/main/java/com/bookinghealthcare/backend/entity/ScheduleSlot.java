package com.bookinghealthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "schedule_slot")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String slot;

    @ManyToOne
    @JoinColumn(name = "schedule_day_id")
    private ScheduleDay scheduleDay;
}
