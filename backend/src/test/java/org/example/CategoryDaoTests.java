package org.example;

import org.example.daos.CategoryDao;
import org.example.exceptions.DaoException;
import org.example.models.Category;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.test.util.ReflectionTestUtils;

import javax.sql.DataSource;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class CategoryDaoTests {

    private CategoryDao categoryDao;
    private JdbcTemplate jdbcTemplate;

    private Category category;

    @BeforeEach
    void setUp() {
        DataSource dataSource = mock(DataSource.class);

        categoryDao = new CategoryDao(dataSource);
        jdbcTemplate = mock(JdbcTemplate.class);

        ReflectionTestUtils.setField(
                categoryDao,
                "jdbcTemplate",
                jdbcTemplate);

        category = new Category(
                1,
                "Sports",
                "Sports and fitness products",
                true,
                "testuser");
    }

    @Test
    void getCategoriesReturnsCategories() {
        when(
                jdbcTemplate.query(
                        anyString(),
                        any(RowMapper.class)))
                .thenReturn(List.of(category));

        List<Category> result = categoryDao.getCategories();

        assertEquals(1, result.size());
        assertEquals(
                "Sports",
                result.get(0).getName());
    }

    @Test
    void getCategoriesSortedByNameDescending() {
        when(
                jdbcTemplate.query(
                        contains("name DESC"),
                        any(RowMapper.class)))
                .thenReturn(List.of(category));

        List<Category> result = categoryDao.getCategoriesSorted(
                "name",
                "desc");

        assertEquals(1, result.size());

        verify(jdbcTemplate).query(
                contains("name DESC"),
                any(RowMapper.class));
    }

    @Test
    void getCategoriesSortedByIdAscending() {
        when(
                jdbcTemplate.query(
                        contains("id ASC"),
                        any(RowMapper.class)))
                .thenReturn(List.of(category));

        List<Category> result = categoryDao.getCategoriesSorted(
                "id",
                "asc");

        assertEquals(1, result.size());

        verify(jdbcTemplate).query(
                contains("id ASC"),
                any(RowMapper.class));
    }

    @Test
    void getCategoryByIdReturnsCategory() {
        when(
                jdbcTemplate.queryForObject(
                        anyString(),
                        any(RowMapper.class),
                        eq(1)))
                .thenReturn(category);

        Category result = categoryDao.getCategoryById(1);

        assertNotNull(result);
        assertEquals(
                "Sports",
                result.getName());
    }

    @Test
    void getCategoryByIdReturnsNullWhenMissing() {
        when(
                jdbcTemplate.queryForObject(
                        anyString(),
                        any(RowMapper.class),
                        eq(99)))
                .thenThrow(
                        new EmptyResultDataAccessException(1));

        Category result = categoryDao.getCategoryById(99);

        assertNull(result);
    }

    @Test
    void searchCategoriesReturnsMatches() {
        when(
                jdbcTemplate.query(
                        anyString(),
                        any(RowMapper.class),
                        any(),
                        any()))
                .thenReturn(List.of(category));

        List<Category> result = categoryDao.searchCategories(
                "Sports",
                "testuser");

        assertEquals(1, result.size());
        assertEquals(
                "Sports",
                result.get(0).getName());
    }

    @Test
    void deleteCategoryReturnsAffectedRows() {
        when(
                jdbcTemplate.update(
                        anyString(),
                        eq(1)))
                .thenReturn(1);

        int result = categoryDao.deleteCategory(1);

        assertEquals(1, result);

        verify(jdbcTemplate)
                .update(anyString(), eq(1));
    }

    @Test
    void updateCategoryReturnsUpdatedCategory() {
        when(
                jdbcTemplate.update(
                        anyString(),
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
                .thenReturn(category);

        Category result = categoryDao.updateCategory(category);

        assertNotNull(result);
        assertEquals(
                "Sports",
                result.getName());
    }

    @Test
    void updateCategoryThrowsWhenNothingUpdated() {
        when(
                jdbcTemplate.update(
                        anyString(),
                        any(),
                        any(),
                        any(),
                        any()))
                .thenReturn(0);

        assertThrows(
                DaoException.class,
                () -> categoryDao.updateCategory(category));
    }
}
