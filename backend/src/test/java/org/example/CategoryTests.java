package org.example;

import org.example.models.Category;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CategoryTests {

    @Test
    void categoryStoresCorrectValues() {

        Category category = new Category(
                1,
                "Sports",
                "Sports and fitness products",
                true,
                "testuser");

        assertEquals(1, category.getId());
        assertEquals("Sports", category.getName());
        assertEquals("Sports and fitness products", category.getDescription());
        assertTrue(category.isPublic());
        assertEquals("testuser", category.getUsername());
    }

    @Test
    void categorySettersUpdateValues() {

        Category category = new Category();

        category.setId(2);
        category.setName("Electronics");
        category.setDescription("Phones and accessories");
        category.setPublic(false);
        category.setUsername("admin");

        assertEquals(2, category.getId());
        assertEquals("Electronics", category.getName());
        assertEquals("Phones and accessories", category.getDescription());
        assertFalse(category.isPublic());
        assertEquals("admin", category.getUsername());
    }
}