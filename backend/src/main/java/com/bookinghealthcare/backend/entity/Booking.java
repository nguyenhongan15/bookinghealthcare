package com.bookinghealthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String patientName;

    @Column(nullable = false)
    private String patientPhone;

    private String note;

    @Column(nullable = true) // lỗi quá thì sửa là false
    private String email;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "schedule_slot_id", nullable = false)
    private ScheduleSlot scheduleSlot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDate date;

    @Column(name = "user_account_id")
    private Long userAccountId;

    @Column(nullable = false)
    private Integer price;

    private LocalDateTime appointmentAt;
    private Boolean reminderSent = false;
    private LocalDateTime reminderSentAt;
    private boolean reviewed = false;
}
