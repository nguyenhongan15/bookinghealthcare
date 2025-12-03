package com.bookinghealthcare.backend.utils;

import java.text.Normalizer;
import java.util.Random;

public class UsernameUtils {

    public static String toUsername(String fullName) {

        if (fullName == null) return null;

        String s = fullName.toLowerCase().trim();

        s = s.replace("đ", "d").replace("Đ", "D");

        // bỏ các học hàm / học vị
        s = s.replaceAll("pgs\\.ts", "")
             .replaceAll("gs\\.ts", "")
             .replaceAll("ts\\.bs", "")
             .replaceAll("bsckii", "")
             .replaceAll("bscki", "")
             .replaceAll("bs\\.", "")
             .replaceAll("bs ", "")
             .replaceAll("ths\\.", "");


        // bỏ dấu tiếng Việt
        String noDiacritics = Normalizer.normalize(s, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");

        // chỉ giữ chữ + số
        String cleaned = noDiacritics.replaceAll("[^a-z0-9]+", "");

        return cleaned;
    }

    public static String randomPassword(int length) {
    String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    Random rnd = new Random();
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < length; i++) {
        sb.append(chars.charAt(rnd.nextInt(chars.length())));
    }
    return sb.toString();
    }
    public static String generateUniqueUsername(String base, java.util.function.Predicate<String> existsFunc) {

        String username = toUsername(base);
    
        // nếu chưa tồn tại → dùng luôn
        if (!existsFunc.test(username)) {
            return username;
        }
    
        // nếu đã tồn tại → thêm số đuôi
        int counter = 1;
        String newUsername;
        while (true) {
            newUsername = username + counter;
            if (!existsFunc.test(newUsername)) {
                return newUsername;
            }
            counter++;
        }
    }
    
}
