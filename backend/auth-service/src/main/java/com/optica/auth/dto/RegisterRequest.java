package com.optica.auth.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "name requerido")
    @Size(min = 2, max = 100)
    private String name;

    @NotBlank(message = "email requerido")
    @Email(message = "email invalido")
    private String email;

    @NotBlank(message = "password requerido")
    @Size(min = 6, message = "password minimo 6 caracteres")
    private String password;

    @Pattern(regexp = "^(ADMIN|USER)?$", message = "role debe ser ADMIN o USER")
    private String role;
}
