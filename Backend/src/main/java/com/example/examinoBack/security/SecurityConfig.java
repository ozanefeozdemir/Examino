package com.example.examinoBack.security;

import com.example.examinoBack.security.jwt.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@EnableMethodSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter; // JWT filtre sınıfımız (her istekte token kontrolü yapar)
    private final UserDetailsService userDetailsService; // Kullanıcı bilgilerini yükleyecek servis

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS'u etkinleştir
                .csrf(csrf -> csrf.disable()) // CSRF'yi devre dışı bırakıyoruz (stateless yapı için gerekli)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**", "/api/auth/register","/by-result/{resultId}", "/api/auth/login", "/api/auth", "api/exams", "api/student-answers/{examId}", "api/exams/{id}","api/student-answers", "api/questions/**", "api/results/teacher", "api/results/student", "api/results/{examId}","api/exams/a/{examId}", "api/users/**", "/api/exams/**", "/api/users/email/", "api/exams/my", "api/exams/assign", "api/exams/assigned", "api/results/getExam")
                        .permitAll()

                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/student/**").hasRole("STUDENT")// /auth/** endpoint'leri herkese açık
                        .anyRequest().authenticated()// diğer tüm istekler için giriş yapılmış olmalı
                )
                .sessionManagement(sess -> sess
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // JWT ile çalışacağımız için oturum kullanılmaz
                )
                .authenticationProvider(authenticationProvider()) // hangi provider ile doğrulama yapılacak
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class) // Her istekte token kontrolü yapan filtre
                .build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));  // Angular frontend adresi
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService); // kullanıcıları yükleyecek servis
        authProvider.setPasswordEncoder(passwordEncoder()); // şifreleri nasıl kontrol edeceğimiz
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Şifreleri BCrypt algoritmasıyla encode edeceğiz
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager(); // Spring Security'nin AuthenticationManager'ını dışarıdan erişilebilir yapar
    }
}
