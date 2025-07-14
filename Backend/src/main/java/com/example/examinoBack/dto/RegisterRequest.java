package com.example.examinoBack.dto;

import com.example.examinoBack.model.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private Role role; // STUDENT veya TEACHER
}