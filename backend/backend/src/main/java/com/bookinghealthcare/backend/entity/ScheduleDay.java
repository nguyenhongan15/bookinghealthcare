package com.bookinghealthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "schedule_day")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    private LocalDate day;

    @OneToMany(mappedBy = "scheduleDay", cascade = CascadeType.ALL)
    private List<ScheduleSlot> slots;
}
