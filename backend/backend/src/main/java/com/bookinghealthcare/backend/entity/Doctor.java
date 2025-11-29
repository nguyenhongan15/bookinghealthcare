package com.bookinghealthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctor")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    private String image;           // Link ảnh
    private String description;     // Mô tả bác sĩ
    private String expertise;       // Nhận khám & điều trị
    private String location;

    @ManyToOne
    @JoinColumn(name = "speciality_id")
    private Speciality speciality;

    @ManyToOne
    @JoinColumn(name = "clinic_id")
    private Clinic clinic;   // Cơ sở y tế/bệnh viện làm việc
}
