package org.example;

import org.example.models.Product;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class ProductTests {

    @Test
    void productStoresCorrectValues() {

        Product product = new Product(
                1,
                "Bluetooth Speaker",
                "Portable wireless speaker",
                new BigDecimal("24.99"),
                10,
                true,
                "testuser",
                1);

        assertEquals(1, product.getId());
        assertEquals("Bluetooth Speaker", product.getName());
        assertEquals("Portable wireless speaker", product.getDescription());
        assertEquals(new BigDecimal("24.99"), product.getPrice());
        assertEquals(10, product.getQuantity());
        assertTrue(product.isPublic());
        assertEquals("testuser", product.getUsername());
        assertEquals(1, product.getCategoryId());
    }

    @Test
    void productSettersUpdateValues() {

        Product product = new Product();

        product.setId(2);
        product.setName("Headphones");
        product.setDescription("Wireless headphones");
        product.setPrice(new BigDecimal("59.99"));
        product.setQuantity(15);
        product.setPublic(false);
        product.setUsername("admin");
        product.setCategoryId(1);

        assertEquals(2, product.getId());
        assertEquals("Headphones", product.getName());
        assertEquals("Wireless headphones", product.getDescription());
        assertEquals(new BigDecimal("59.99"), product.getPrice());
        assertEquals(15, product.getQuantity());
        assertFalse(product.isPublic());
        assertEquals("admin", product.getUsername());
        assertEquals(1, product.getCategoryId());
    }
}