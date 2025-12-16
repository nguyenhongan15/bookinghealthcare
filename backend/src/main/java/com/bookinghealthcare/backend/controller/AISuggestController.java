package com.bookinghealthcare.backend.controller;

import com.bookinghealthcare.backend.common.ApiResponse;
import com.bookinghealthcare.backend.entity.Doctor;
import com.bookinghealthcare.backend.entity.Speciality;
import com.bookinghealthcare.backend.repository.DoctorRepository;
import com.bookinghealthcare.backend.repository.SpecialityRepository;
import com.bookinghealthcare.backend.service.SymptomAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin
public class AISuggestController {

    private final SymptomAIService aiService;
    private final SpecialityRepository specialityRepo;
    private final DoctorRepository doctorRepo;

    // Request body: { "symptom": "..." }
    @PostMapping("/suggest")
    public ApiResponse<?> suggest(@RequestBody Map<String, String> req) {
        String symptom = req.getOrDefault("symptom", "");

        List<String> suggestedNames = aiService.suggestSpecialties(symptom);

        List<Speciality> specialties =
                specialityRepo.findByTitleIn(suggestedNames);

        List<Doctor> doctors =
                doctorRepo.findBySpeciality_TitleIn(suggestedNames);


        Map<String, Object> data = new HashMap<>();
        data.put("suggestedSpecialityNames", suggestedNames);
        data.put("specialties", specialties);
        data.put("doctors", doctors);

        return ApiResponse.success(data);
    }
}
