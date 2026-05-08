package com.optica.product.dto;

import com.optica.product.model.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private Long id;
    private String name;

    public static CategoryResponse from(Category c) {
        return new CategoryResponse(c.getId(), c.getName());
    }
}
