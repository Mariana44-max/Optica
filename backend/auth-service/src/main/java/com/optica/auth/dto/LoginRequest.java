package com.optica.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "email requerido")
    @Email
    private String email;

    @NotBlank(message = "password requerido")
    private String password;
}
