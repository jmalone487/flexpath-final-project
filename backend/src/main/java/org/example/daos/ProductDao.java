package org.example.daos;

import org.example.exceptions.DaoException;
import org.example.models.Product;
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
public class ProductDao {

    private final JdbcTemplate jdbcTemplate;

    public ProductDao(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public List<Product> getProducts() {
        String sql = "SELECT * FROM products ORDER BY name;";
        return jdbcTemplate.query(sql, this::mapToProduct);
    }

    public List<Product> getProductsSorted(String sortBy, String direction) {

        String column;

        if ("price".equalsIgnoreCase(sortBy)) {
            column = "price";
        } else {
            column = "name";
        }

        String sortDirection;

        if ("desc".equalsIgnoreCase(direction)) {
            sortDirection = "DESC";
        } else {
            sortDirection = "ASC";
        }

        String sql = "SELECT * FROM products ORDER BY "
                + column + " " + sortDirection + ";";

        return jdbcTemplate.query(sql, this::mapToProduct);
    }

    public Product getProductById(int id) {
        try {
            String sql = "SELECT * FROM products WHERE id = ?;";

            return jdbcTemplate.queryForObject(
                    sql,
                    this::mapToProduct,
                    id);

        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public Product createProduct(Product product) {

        String sql = """
                INSERT INTO products
                (name, description, price, quantity,
                 is_public, username, category_id)
                VALUES (?, ?, ?, ?, ?, ?, ?);
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {

            PreparedStatement statement = connection.prepareStatement(
                    sql,
                    Statement.RETURN_GENERATED_KEYS);

            statement.setString(1, product.getName());
            statement.setString(2, product.getDescription());
            statement.setBigDecimal(3, product.getPrice());
            statement.setInt(4, product.getQuantity());
            statement.setBoolean(5, product.isPublic());
            statement.setString(6, product.getUsername());

            if (product.getCategoryId() == null) {
                statement.setNull(
                        7,
                        java.sql.Types.INTEGER);
            } else {
                statement.setInt(
                        7,
                        product.getCategoryId());
            }

            return statement;

        }, keyHolder);

        Number key = keyHolder.getKey();

        if (key == null) {
            throw new DaoException(
                    "Failed to create product.");
        }

        return getProductById(key.intValue());
    }

    public Product updateProduct(Product product) {

        String sql = """
                UPDATE products
                SET name = ?,
                    description = ?,
                    price = ?,
                    quantity = ?,
                    is_public = ?,
                    category_id = ?
                WHERE id = ?;
                """;

        int rowsAffected = jdbcTemplate.update(
                sql,
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getQuantity(),
                product.isPublic(),
                product.getCategoryId(),
                product.getId());

        if (rowsAffected == 0) {
            throw new DaoException(
                    "Zero rows affected, expected at least one.");
        }

        return getProductById(product.getId());
    }

    public int deleteProduct(int id) {

        String sql = "DELETE FROM products WHERE id = ?;";

        return jdbcTemplate.update(sql, id);
    }

    public List<Product> searchProducts(
            String name,
            String username) {

        String sql = """
                SELECT *
                FROM products
                WHERE name LIKE ?
                AND username = ?
                ORDER BY name;
                """;

        return jdbcTemplate.query(
                sql,
                this::mapToProduct,
                "%" + name + "%",
                username);
    }

    private Product mapToProduct(
            ResultSet resultSet,
            int rowNumber) throws SQLException {

        Integer categoryId = (Integer) resultSet.getObject(
                "category_id");

        return new Product(
                resultSet.getInt("id"),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getBigDecimal("price"),
                resultSet.getInt("quantity"),
                resultSet.getBoolean("is_public"),
                resultSet.getString("username"),
                categoryId);
    }
}