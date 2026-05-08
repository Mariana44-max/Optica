package com.optica.auth.controller;

import com.optica.auth.dto.AuthResponse;
import com.optica.auth.dto.LoginRequest;
import com.optica.auth.dto.RegisterRequest;
import com.optica.auth.dto.UserResponse;
import com.optica.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest req) {
        UserResponse user = authService.register(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Usuario registrado",
                "user", user
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest req) {
        AuthResponse data = authService.login(req);
        return ResponseEntity.ok(Map.of(
                "message", "Login exitoso",
                "token", data.getToken(),
                "user", data.getUser()
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(Map.of(
                "email", auth.getName(),
                "authorities", auth.getAuthorities()
        ));
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validate() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(Map.of("valid", true, "email", auth.getName()));
    }
}
