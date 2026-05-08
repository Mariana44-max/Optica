package com.optica.product.repository;

import com.optica.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByOrderByIdDesc();
    List<Product> findByCategoryIdOrderByIdDesc(Long categoryId);
}
