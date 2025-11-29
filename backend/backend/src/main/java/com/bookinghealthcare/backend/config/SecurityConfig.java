package com.bookinghealthcare.backend.config;

import com.bookinghealthcare.backend.middleware.AdminCheck;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;
import org.springframework.security.config.Customizer;

@Configuration
public class SecurityConfig implements WebMvcConfigurer {

    @Autowired
    private AdminCheck adminCheck;   // ⭐ Thêm Interceptor

    // ==========================
    // ⭐ Interceptor Admin Check
    // ==========================
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(adminCheck)
                .addPathPatterns("/api/**");   // Áp cho toàn bộ API
    }

    // ==========================
    // ⭐ Cấu hình Security (CORS + disable csrf)
    // ==========================
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                )
                .httpBasic(basic -> basic.disable())   // ⛔ TẮT BASIC AUTH
                .formLogin(login -> login.disable());  // ⛔ TẮT FORM LOGIN

        return http.build();
    }

    // ==========================
    // ⭐ Cấu hình CORS cho React
    // ==========================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("*"));
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
