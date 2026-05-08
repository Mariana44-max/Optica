package com.optica.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryRequest {

    @NotBlank(message = "name requerido")
    @Size(min = 2, max = 80)
    private String name;
}
