package com.bookinghealthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "clinic")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Clinic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String address;

    private String hotline;

    private String image;

    @OneToMany(mappedBy = "clinic")
    private List<Doctor> doctors;  // Danh sách bác sĩ thuộc cơ sở
}
