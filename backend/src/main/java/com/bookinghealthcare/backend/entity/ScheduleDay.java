package com.bookinghealthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;


import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
    @JsonIgnoreProperties({"speciality", "clinic", "scheduleDays"})
    private Doctor doctor;

    private String day;

    @OneToMany(mappedBy = "scheduleDay")
    @JsonIgnoreProperties({"scheduleDay"})   // CHẶN NGƯỢC LẠI
    private List<ScheduleSlot> slots;


}
