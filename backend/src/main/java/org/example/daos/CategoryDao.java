package org.example.daos;

import org.example.exceptions.DaoException;
import org.example.models.Category;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

@Component
public class CategoryDao {

    private final JdbcTemplate jdbcTemplate;

    public CategoryDao(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public List<Category> getCategories() {
        String sql = "SELECT * FROM categories ORDER BY name;";
        return jdbcTemplate.query(sql, this::mapToCategory);
    }

    public List<Category> getCategoriesSorted(String sortBy, String direction) {

        String column;

        if ("id".equalsIgnoreCase(sortBy)) {
            column = "id";
        } else {
            column = "name";
        }

        String sortDirection;

        if ("desc".equalsIgnoreCase(direction)) {
            sortDirection = "DESC";
        } else {
            sortDirection = "ASC";
        }

        String sql = "SELECT * FROM categories ORDER BY "
                + column + " " + sortDirection + ";";

        return jdbcTemplate.query(sql, this::mapToCategory);
    }

    public Category getCategoryById(int id) {
        try {
            String sql = "SELECT * FROM categories WHERE id = ?;";

            return jdbcTemplate.queryForObject(
                    sql,
                    this::mapToCategory,
                    id);

        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public Category createCategory(Category category) {

        String sql = """
                INSERT INTO categories
                (name, description, is_public, username)
                VALUES (?, ?, ?, ?);
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {

            PreparedStatement statement = connection.prepareStatement(
                    sql,
                    Statement.RETURN_GENERATED_KEYS);

            statement.setString(1, category.getName());
            statement.setString(2, category.getDescription());
            statement.setBoolean(3, category.isPublic());
            statement.setString(4, category.getUsername());

            return statement;

        }, keyHolder);

        Number key = keyHolder.getKey();

        if (key == null) {
            throw new DaoException("Failed to create category.");
        }

        return getCategoryById(key.intValue());
    }

    public Category updateCategory(Category category) {

        String sql = """
                UPDATE categories
                SET name = ?,
                    description = ?,
                    is_public = ?
                WHERE id = ?;
                """;

        int rowsAffected = jdbcTemplate.update(
                sql,
                category.getName(),
                category.getDescription(),
                category.isPublic(),
                category.getId());

        if (rowsAffected == 0) {
            throw new DaoException(
                    "Zero rows affected, expected at least one.");
        }

        return getCategoryById(category.getId());
    }

    public int deleteCategory(int id) {

        String sql = "DELETE FROM categories WHERE id = ?;";

        return jdbcTemplate.update(sql, id);
    }

    public List<Category> searchCategories(
            String name,
            String username) {

        String sql = """
                SELECT *
                FROM categories
                WHERE name LIKE ?
                AND username = ?
                ORDER BY name;
                """;

        return jdbcTemplate.query(
                sql,
                this::mapToCategory,
                "%" + name + "%",
                username);
    }

    private Category mapToCategory(
            ResultSet resultSet,
            int rowNumber) throws SQLException {

        return new Category(
                resultSet.getInt("id"),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getBoolean("is_public"),
                resultSet.getString("username"));
    }
}