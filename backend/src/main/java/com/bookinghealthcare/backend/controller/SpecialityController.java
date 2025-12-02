package com.bookinghealthcare.backend.controller;

import com.bookinghealthcare.backend.entity.Speciality;
import com.bookinghealthcare.backend.repository.SpecialityRepository;
import com.bookinghealthcare.backend.dto.SpecialityRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/specialities")
@CrossOrigin
public class SpecialityController {

    @Autowired
    private SpecialityRepository specialityRepository;

    // Lấy tất cả chuyên khoa
    @GetMapping
    public List<Speciality> getAll() {
        return specialityRepository.findAll();
    }

    // Lấy chuyên khoa theo ID
    @GetMapping("/{id}")
    public Speciality getById(@PathVariable Integer id) {
        return specialityRepository.findById(id).orElse(null);
    }

    // Thêm chuyên khoa
    @PostMapping
    public Speciality create(@RequestBody SpecialityRequest req) {
        Speciality sp = new Speciality();
        sp.setCode(req.getCode());
        sp.setTitle(req.getTitle());
        sp.setImage(req.getImage());
        return specialityRepository.save(sp);
    }

    // Cập nhật chuyên khoa
    @PutMapping("/{id}")
    public Speciality update(@PathVariable Integer id, @RequestBody SpecialityRequest req) {
        return specialityRepository.findById(id)
                .map(sp -> {
                    sp.setCode(req.getCode());
                    sp.setTitle(req.getTitle());
                    sp.setImage(req.getImage());
                    return specialityRepository.save(sp);
                })
                .orElse(null);
    }

    // =========================
    //     UPDATE IMAGE ONLY
    // =========================
    @PutMapping("/{id}/image")
    public ResponseEntity<Speciality> updateImage(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body
    ) {
        String imageUrl = body.get("image");

        Speciality sp = specialityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Speciality not found"));

        sp.setImage(imageUrl);
        specialityRepository.save(sp);

        return ResponseEntity.ok(sp);
    }

    // Xóa chuyên khoa
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        specialityRepository.deleteById(id);
        return "Deleted speciality id = " + id;
    }
}
