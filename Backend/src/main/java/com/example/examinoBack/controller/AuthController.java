package com.example.examinoBack.controller;


import com.example.examinoBack.dto.AuthenticationRequest;
import com.example.examinoBack.dto.AuthenticationResponse;
import com.example.examinoBack.dto.RegisterRequest;
import com.example.examinoBack.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class AuthController {

    private final AuthenticationService authenticationService;


    @PostMapping("/register") // OK
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/login") // OK
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }
}
