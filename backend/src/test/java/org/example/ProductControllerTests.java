package org.example;

import org.example.controllers.ProductController;
import org.example.daos.ProductDao;
import org.example.daos.UserDao;
import org.example.models.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ProductControllerTests {

    private ProductController controller;
    private ProductDao productDao;
    private UserDao userDao;
    private Principal principal;

    @BeforeEach
    void setUp() {
        controller = new ProductController();

        productDao = mock(ProductDao.class);
        userDao = mock(UserDao.class);

        ReflectionTestUtils.setField(
                controller,
                "productDao",
                productDao);

        ReflectionTestUtils.setField(
                controller,
                "userDao",
                userDao);

        principal = () -> "testuser";
    }

    @Test
    void getAllReturnsPublicProducts() {
        Product product = new Product(
                1,
                "Bluetooth Speaker",
                "Portable wireless speaker",
                new BigDecimal("24.99"),
                10,
                true,
                "testuser",
                1);

        when(productDao.getProducts())
                .thenReturn(List.of(product));

        List<Product> result = controller.getAll(principal);

        assertEquals(1, result.size());
        assertEquals(
                "Bluetooth Speaker",
                result.get(0).getName());
    }

    @Test
    void createSetsLoggedInUsername() {
        Product product = new Product();

        when(productDao.createProduct(product))
                .thenReturn(product);

        controller.create(product, principal);

        assertEquals(
                "testuser",
                product.getUsername());

        verify(productDao)
                .createProduct(product);
    }

    @Test
    void deleteOwnProductWorks() {
        Product product = new Product(
                1,
                "Bluetooth Speaker",
                "Portable wireless speaker",
                new BigDecimal("24.99"),
                10,
                true,
                "testuser",
                1);

        when(productDao.getProductById(1))
                .thenReturn(product);

        when(productDao.deleteProduct(1))
                .thenReturn(1);

        int result = controller.delete(1, principal);

        assertEquals(1, result);

        verify(productDao)
                .deleteProduct(1);
    }

    @Test
    void getByIdReturnsProduct() {
        Product product = new Product(
                1,
                "Bluetooth Speaker",
                "Portable wireless speaker",
                new BigDecimal("24.99"),
                10,
                true,
                "testuser",
                1);

        when(productDao.getProductById(1))
                .thenReturn(product);

        Product result = controller.getById(1, principal);

        assertEquals(
                "Bluetooth Speaker",
                result.getName());
    }

    @Test
    void sortReturnsSortedProducts() {
        Product product = new Product(
                1,
                "Bluetooth Speaker",
                "Portable wireless speaker",
                new BigDecimal("24.99"),
                10,
                true,
                "testuser",
                1);

        when(
                productDao.getProductsSorted(
                        "price",
                        "asc"))
                .thenReturn(List.of(product));

        List<Product> result = controller.sort(
                "price",
                "asc",
                principal);

        assertEquals(1, result.size());
    }

    @Test
    void searchReturnsMatchingProducts() {
        Product product = new Product(
                1,
                "Bluetooth Speaker",
                "Portable wireless speaker",
                new BigDecimal("24.99"),
                10,
                true,
                "testuser",
                1);

        when(
                productDao.searchProducts(
                        "Bluetooth",
                        "testuser"))
                .thenReturn(List.of(product));

        List<Product> result = controller.search(
                "Bluetooth",
                "testuser",
                principal);

        assertEquals(1, result.size());
        assertEquals(
                "Bluetooth Speaker",
                result.get(0).getName());
    }
}