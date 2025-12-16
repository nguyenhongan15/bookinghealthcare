package com.bookinghealthcare.backend.service;

import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.*;

@Service
public class SymptomAIService {

    // Chuẩn hoá text: bỏ dấu + lowercase
    private String normalize(String s) {
        if (s == null) return "";
        String t = s.toLowerCase().trim();
        t = Normalizer.normalize(t, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        t = t.replace("đ", "d");
        return t;
    }

    public List<String> suggestSpecialties(String symptomText) {
        String text = normalize(symptomText);

        // keyword -> specialties
        Map<String, List<String>> map = new LinkedHashMap<>();
        map.put("dau dau", List.of("Thần kinh", "Nội tổng quát"));
        map.put("chong mat", List.of("Thần kinh", "Tai mũi họng"));
        map.put("mat ngu", List.of("Thần kinh"));
        map.put("dau bung", List.of("Tiêu hóa"));
        map.put("tieu chay", List.of("Tiêu hóa"));
        map.put("tao bon", List.of("Tiêu hóa"));
        map.put("ho", List.of("Hô hấp"));
        map.put("kho tho", List.of("Hô hấp"));
        map.put("dau hong", List.of("Tai mũi họng"));
        map.put("so mui", List.of("Tai mũi họng"));
        map.put("sot", List.of("Nội tổng quát"));
        map.put("phat ban", List.of("Da liễu"));
        map.put("ngua", List.of("Da liễu"));
        map.put("noi mun", List.of("Da liễu"));
        map.put("dau nguc", List.of("Tim mạch", "Nội tổng quát"));
        map.put("hoi hop", List.of("Tim mạch"));
        map.put("dau tim", List.of("Tim mạch"));

        // chấm điểm theo số lần match
        Map<String, Integer> score = new HashMap<>();

        for (var entry : map.entrySet()) {
            String keyword = entry.getKey();
            if (text.contains(keyword)) {
                for (String sp : entry.getValue()) {
                    score.put(sp, score.getOrDefault(sp, 0) + 1);
                }
            }
        }

        if (score.isEmpty()) return List.of("Nội tổng quát");

        // sort theo điểm giảm dần
        return score.entrySet().stream()
                .sorted((a, b) -> Integer.compare(b.getValue(), a.getValue()))
                .map(Map.Entry::getKey)
                .toList();
    }
}
