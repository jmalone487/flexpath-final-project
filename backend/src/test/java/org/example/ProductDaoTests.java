package org.example;

import org.example.daos.ProductDao;
import org.example.exceptions.DaoException;
import org.example.models.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.test.util.ReflectionTestUtils;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ProductDaoTests {

    private ProductDao productDao;
    private JdbcTemplate jdbcTemplate;

    private Product product;

    @BeforeEach
    void setUp() {
        DataSource dataSource = mock(DataSource.class);

        productDao = new ProductDao(dataSource);
        jdbcTemplate = mock(JdbcTemplate.class);

        ReflectionTestUtils.setField(
                productDao,
                "jdbcTemplate",
                jdbcTemplate);

        product = new Product(
                1,
                "Bluetooth Speaker",
                "Portable wireless speaker",
                new BigDecimal("24.99"),
                10,
                true,
                "testuser",
                1);
    }

    @Test
    void getProductsReturnsProducts() {
        when(
                jdbcTemplate.query(
                        anyString(),
                        any(RowMapper.class)))
                .thenReturn(List.of(product));

        List<Product> result = productDao.getProducts();

        assertEquals(1, result.size());
        assertEquals(
                "Bluetooth Speaker",
                result.get(0).getName());
    }

    @Test
    void getProductsSortedByPriceDescending() {
        when(
                jdbcTemplate.query(
                        contains("price DESC"),
                        any(RowMapper.class)))
                .thenReturn(List.of(product));

        List<Product> result = productDao.getProductsSorted(
                "price",
                "desc");

        assertEquals(1, result.size());

        verify(jdbcTemplate).query(
                contains("price DESC"),
                any(RowMapper.class));
    }

    @Test
    void getProductsSortedByNameAscending() {
        when(
                jdbcTemplate.query(
                        contains("name ASC"),
                        any(RowMapper.class)))
                .thenReturn(List.of(product));

        List<Product> result = productDao.getProductsSorted(
                "name",
                "asc");

        assertEquals(1, result.size());

        verify(jdbcTemplate).query(
                contains("name ASC"),
                any(RowMapper.class));
    }

    @Test
    void getProductByIdReturnsProduct() {
        when(
                jdbcTemplate.queryForObject(
                        anyString(),
                        any(RowMapper.class),
                        eq(1)))
                .thenReturn(product);

        Product result = productDao.getProductById(1);

        assertNotNull(result);
        assertEquals(
                "Bluetooth Speaker",
                result.getName());
    }

    @Test
    void getProductByIdReturnsNullWhenMissing() {
        when(
                jdbcTemplate.queryForObject(
                        anyString(),
                        any(RowMapper.class),
                        eq(99)))
                .thenThrow(
                        new EmptyResultDataAccessException(1));

        Product result = productDao.getProductById(99);

        assertNull(result);
    }

    @Test
    void searchProductsReturnsMatches() {
        when(
                jdbcTemplate.query(
                        anyString(),
                        any(RowMapper.class),
                        any(),
                        any()))
                .thenReturn(List.of(product));

        List<Product> result = productDao.searchProducts(
                "Bluetooth",
                "testuser");

        assertEquals(1, result.size());
        assertEquals(
                "Bluetooth Speaker",
                result.get(0).getName());
    }

    @Test
    void deleteProductReturnsAffectedRows() {
        when(
                jdbcTemplate.update(
                        anyString(),
                        eq(1)))
                .thenReturn(1);

        int result = productDao.deleteProduct(1);

        assertEquals(1, result);

        verify(jdbcTemplate)
                .update(anyString(), eq(1));
    }

    @Test
    void updateProductReturnsUpdatedProduct() {
        when(
                jdbcTemplate.update(
                        anyString(),
                        any(),
                        any(),
                        any(),
                        any(),
                        any(),
                        any(),
                        any()))
                .thenReturn(1);

        when(
                jdbcTemplate.queryForObject(
                        anyString(),
                        any(RowMapper.class),
                        eq(1)))
                .thenReturn(product);

        Product result = productDao.updateProduct(product);

        assertNotNull(result);
        assertEquals(
                "Bluetooth Speaker",
                result.getName());
    }

    @Test
    void updateProductThrowsWhenNothingUpdated() {
        when(
                jdbcTemplate.update(
                        anyString(),
                        any(),
                        any(),
                        any(),
                        any(),
                        any(),
                        any(),
                        any()))
                .thenReturn(0);

        assertThrows(
                DaoException.class,
                () -> productDao.updateProduct(product));
    }
}