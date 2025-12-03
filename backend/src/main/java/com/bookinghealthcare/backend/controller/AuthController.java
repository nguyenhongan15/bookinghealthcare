package com.bookinghealthcare.backend.controller;

import java.util.Map;
import com.bookinghealthcare.backend.common.ApiResponse;
import com.bookinghealthcare.backend.dto.LoginRequest;
import com.bookinghealthcare.backend.dto.LoginResponse;
import com.bookinghealthcare.backend.dto.RegisterRequest;
import com.bookinghealthcare.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<?> login(@RequestBody LoginRequest req) {
        LoginResponse res = authService.login(req);
        return ApiResponse.success("Login success", res);
    }

    @PostMapping("/register")
    public ApiResponse<?> register(@RequestBody RegisterRequest req) {
        LoginResponse res = authService.register(req);
        return ApiResponse.success("Register success", res);
    }

    @GetMapping("/check-username")
    public ApiResponse<?> checkUsername(@RequestParam String username) {
        boolean exists = authService.exists(username);
        return ApiResponse.success("OK", Map.of("available", !exists));
    }

}
