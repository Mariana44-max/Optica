package com.optica.product.service;

import com.optica.product.dto.ProductRequest;
import com.optica.product.dto.ProductResponse;
import com.optica.product.exception.ApiException;
import com.optica.product.model.Category;
import com.optica.product.model.Product;
import com.optica.product.repository.CategoryRepository;
import com.optica.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public List<ProductResponse> list(Long categoryId) {
        var entities = (categoryId == null)
                ? productRepository.findAllByOrderByIdDesc()
                : productRepository.findByCategoryIdOrderByIdDesc(categoryId);
        return entities.stream().map(ProductResponse::from).toList();
    }

    public ProductResponse getById(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        return ProductResponse.from(p);
    }

    public ProductResponse create(ProductRequest req) {
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "La categoria no existe"));

        Product saved = productRepository.save(Product.builder()
                .name(req.getName())
                .description(req.getDescription())
                .price(req.getPrice())
                .stock(req.getStock())
                .category(category)
                .build());
        return ProductResponse.from(saved);
    }

    public ProductResponse update(Long id, ProductRequest req) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Producto no encontrado"));

        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "La categoria no existe"));

        product.setName(req.getName());
        product.setDescription(req.getDescription());
        product.setPrice(req.getPrice());
        product.setStock(req.getStock());
        product.setCategory(category);

        return ProductResponse.from(productRepository.save(product));
    }

    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Producto no encontrado");
        }
        productRepository.deleteById(id);
    }
}
