package com.bookinghealthcare.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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

    private String image;
    private String description;
    private String expertise;
    private String location;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String achievement;


    @ManyToOne
    @JoinColumn(name = "speciality_id")
    private Speciality speciality;

    @ManyToOne
    @JoinColumn(name = "clinic_id")
    // @JsonIgnoreProperties({"clinic", "speciality"}) // NẾU SAI THÌ LẤY LẠI DÒNG NÀY
    @JsonIgnoreProperties({"doctors"})   // DÒNG NÀY LÀ DÒNG MỚI THÊM
    private Clinic clinic;
}
