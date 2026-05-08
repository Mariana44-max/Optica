package com.optica.product.config;

import com.optica.product.model.Category;
import com.optica.product.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        String[] defaults = {"Lentes formulados", "Gafas de sol", "Monturas", "Lentes de contacto"};
        for (String name : defaults) {
            categoryRepository.findByName(name)
                    .orElseGet(() -> categoryRepository.save(Category.builder().name(name).build()));
        }
    }
}
