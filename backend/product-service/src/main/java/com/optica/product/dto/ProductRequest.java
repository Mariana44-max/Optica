package com.optica.product.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {

    @NotBlank(message = "name requerido")
    @Size(min = 2, max = 120)
    private String name;

    private String description;

    @NotNull(message = "price requerido")
    @DecimalMin(value = "0.0", inclusive = true, message = "price invalido")
    private BigDecimal price;

    @NotNull(message = "stock requerido")
    @Min(value = 0, message = "stock invalido")
    private Integer stock;

    @NotNull(message = "categoryId requerido")
    private Long categoryId;
}
