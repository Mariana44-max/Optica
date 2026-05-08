package com.optica.product.service;

import com.optica.product.dto.CategoryRequest;
import com.optica.product.dto.CategoryResponse;
import com.optica.product.exception.ApiException;
import com.optica.product.model.Category;
import com.optica.product.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> list() {
        return categoryRepository.findAllByOrderByNameAsc().stream()
                .map(CategoryResponse::from)
                .toList();
    }

    public CategoryResponse create(CategoryRequest req) {
        if (categoryRepository.findByName(req.getName()).isPresent()) {
            throw new ApiException(HttpStatus.CONFLICT, "La categoria ya existe");
        }
        Category created = categoryRepository.save(Category.builder().name(req.getName()).build());
        return CategoryResponse.from(created);
    }
}
