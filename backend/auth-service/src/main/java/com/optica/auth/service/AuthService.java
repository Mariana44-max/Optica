package com.optica.auth.service;

import com.optica.auth.dto.AuthResponse;
import com.optica.auth.dto.LoginRequest;
import com.optica.auth.dto.RegisterRequest;
import com.optica.auth.dto.UserResponse;
import com.optica.auth.exception.ApiException;
import com.optica.auth.model.Role;
import com.optica.auth.model.User;
import com.optica.auth.repository.RoleRepository;
import com.optica.auth.repository.UserRepository;
import com.optica.auth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ApiException(HttpStatus.CONFLICT, "El email ya esta registrado");
        }

        String roleName = (req.getRole() == null || req.getRole().isBlank()) ? "USER" : req.getRole();
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Rol no valido"));

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(role)
                .build();

        return UserResponse.from(userRepository.save(user));
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Credenciales invalidas"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Credenciales invalidas");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().getName());
        return AuthResponse.builder()
                .token(token)
                .user(UserResponse.from(user))
                .build();
    }
}
