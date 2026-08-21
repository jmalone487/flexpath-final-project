package org.example;

import org.example.controllers.CategoryController;
import org.example.daos.CategoryDao;
import org.example.daos.UserDao;
import org.example.models.Category;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.Principal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class CategoryControllerTests {

    private CategoryController controller;
    private CategoryDao categoryDao;
    private UserDao userDao;
    private Principal principal;

    @BeforeEach
    void setUp() {
        controller = new CategoryController();

        categoryDao = mock(CategoryDao.class);
        userDao = mock(UserDao.class);

        ReflectionTestUtils.setField(
                controller,
                "categoryDao",
                categoryDao);

        ReflectionTestUtils.setField(
                controller,
                "userDao",
                userDao);

        principal = () -> "testuser";
    }

    @Test
    void getAllReturnsPublicCategories() {
        Category category = new Category(
                1,
                "Sports",
                "Sports and fitness products",
                true,
                "testuser");

        when(categoryDao.getCategories())
                .thenReturn(List.of(category));

        List<Category> result = controller.getAll(principal);

        assertEquals(1, result.size());
        assertEquals(
                "Sports",
                result.get(0).getName());
    }

    @Test
    void createSetsLoggedInUsername() {
        Category category = new Category();

        when(categoryDao.createCategory(category))
                .thenReturn(category);

        controller.create(category, principal);

        assertEquals(
                "testuser",
                category.getUsername());

        verify(categoryDao)
                .createCategory(category);
    }

    @Test
    void deleteOwnCategoryWorks() {
        Category category = new Category(
                1,
                "Sports",
                "Sports and fitness products",
                true,
                "testuser");

        when(categoryDao.getCategoryById(1))
                .thenReturn(category);

        when(categoryDao.deleteCategory(1))
                .thenReturn(1);

        int result = controller.delete(1, principal);

        assertEquals(1, result);

        verify(categoryDao)
                .deleteCategory(1);
    }

    @Test
    void getByIdReturnsCategory() {
        Category category = new Category(
                1,
                "Sports",
                "Sports and fitness products",
                true,
                "testuser");

        when(categoryDao.getCategoryById(1))
                .thenReturn(category);

        Category result = controller.getById(1, principal);

        assertEquals(
                "Sports",
                result.getName());
    }

    @Test
    void sortReturnsSortedCategories() {
        Category category = new Category(
                1,
                "Sports",
                "Sports and fitness products",
                true,
                "testuser");

        when(
                categoryDao.getCategoriesSorted(
                        "name",
                        "desc"))
                .thenReturn(List.of(category));

        List<Category> result = controller.sort(
                "name",
                "desc",
                principal);

        assertEquals(1, result.size());
    }

    @Test
    void searchReturnsMatchingCategories() {
        Category category = new Category(
                1,
                "Sports",
                "Sports and fitness products",
                true,
                "testuser");

        when(
                categoryDao.searchCategories(
                        "Sports",
                        "testuser"))
                .thenReturn(List.of(category));

        List<Category> result = controller.search(
                "Sports",
                "testuser",
                principal);

        assertEquals(1, result.size());

        assertEquals(
                "Sports",
                result.get(0).getName());
    }
}