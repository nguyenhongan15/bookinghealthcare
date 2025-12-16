package com.bookinghealthcare.backend.repository;

import com.bookinghealthcare.backend.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {

    @Query("""
        SELECT d FROM Doctor d
        WHERE (:location IS NULL OR d.location = :location)
        AND (:clinicId IS NULL OR d.clinic.id = :clinicId)
        AND (:specialityId IS NULL OR d.speciality.id = :specialityId)
    """)
    List<Doctor> filterDoctors(
            @Param("location") String location,
            @Param("clinicId") Integer clinicId,
            @Param("specialityId") Integer specialityId
    );

    List<Doctor> findByClinic_Id(Integer clinicId);

    List<Doctor> findBySpeciality_Id(Integer specialityId);

    Doctor findByNameAndClinic_IdAndSpeciality_Id(String name, Integer clinicId, Integer specialityId);

    List<Doctor> findBySpeciality_TitleIn(List<String> titles);

}
