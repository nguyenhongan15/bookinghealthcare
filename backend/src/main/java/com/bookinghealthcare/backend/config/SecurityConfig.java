package com.bookinghealthcare.backend.config;

import com.bookinghealthcare.backend.middleware.AdminCheck;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private AdminCheck adminCheck;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(adminCheck)
                .addPathPatterns("/api/**");
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers(
                        "/api/**",
                        "/images/**",
                        "/ws/**"
                    ).permitAll()
                    .anyRequest().authenticated());

        return http.build();
    }

    @Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOriginPatterns(List.of(
        "http://localhost:5173",
        "https://*.vercel.app"
    ));
    config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}


    @Bean
        public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }



}
