package com.bookinghealthcare.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    // Thư mục ảnh bên ngoài project
    @Value("${file.upload-dir}")
    private String uploadDir;

    // =========== UPLOAD IMAGE BÁC SĨ ===========
    @PostMapping("/doctor-image")
    public ResponseEntity<String> uploadDoctorImage(@RequestParam("file") MultipartFile file) {
        return saveImage(file, "doctors");
    }

    // =========== UPLOAD IMAGE CHUYÊN KHOA ===========
    @PostMapping("/speciality-image")
    public ResponseEntity<String> uploadSpecialityImage(@RequestParam("file") MultipartFile file) {
        return saveImage(file, "specialities");
    }

    // upload co so y te
    @PostMapping("/clinic-image")
    public ResponseEntity<String> uploadClinicImage(@RequestParam("file") MultipartFile file) {
        return saveImage(file, "clinics");
    }

    // ================== HÀM DÙNG CHUNG =================
    private ResponseEntity<String> saveImage(MultipartFile file, String folder) {
        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            Path uploadPath = Paths.get(uploadDir + folder + "/");

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Files.write(uploadPath.resolve(fileName), file.getBytes());

            // URL ảnh trả về cho frontend
            String url = "/images/" + folder + "/" + fileName;

            return ResponseEntity.ok(url);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Upload failed!");
        }
    }
}
