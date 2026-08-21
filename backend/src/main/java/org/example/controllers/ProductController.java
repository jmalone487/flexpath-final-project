package org.example.controllers;

import org.example.daos.ProductDao;
import org.example.daos.UserDao;
import org.example.models.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductDao productDao;

    @Autowired
    private UserDao userDao;

    @GetMapping
    @PreAuthorize("permitAll()")
    public List<Product> getAll(Principal principal) {

        List<Product> products = productDao.getProducts();

        return products.stream()
                .filter(product -> canView(product, principal))
                .toList();
    }

    @GetMapping("/sort")
    @PreAuthorize("permitAll()")
    public List<Product> sort(
            @RequestParam String sortBy,
            @RequestParam String direction,
            Principal principal) {

        return productDao
                .getProductsSorted(sortBy, direction)
                .stream()
                .filter(product -> canView(product, principal))
                .toList();
    }

    @GetMapping("/search")
    @PreAuthorize("permitAll()")
    public List<Product> search(
            @RequestParam String name,
            @RequestParam String username,
            Principal principal) {

        return productDao.searchProducts(name, username)
                .stream()
                .filter(product -> canView(product, principal))
                .toList();
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public Product getById(
            @PathVariable int id,
            Principal principal) {

        Product product = productDao.getProductById(id);

        if (product == null || !canView(product, principal)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Product not found");
        }

        return product;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    public Product create(
            @RequestBody Product product,
            Principal principal) {

        product.setUsername(principal.getName());

        return productDao.createProduct(product);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public Product update(
            @PathVariable int id,
            @RequestBody Product product,
            Principal principal) {

        Product existingProduct = productDao.getProductById(id);

        if (existingProduct == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Product not found");
        }

        if (!canManage(existingProduct, principal)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You do not have permission to edit this product");
        }

        product.setId(id);
        product.setUsername(existingProduct.getUsername());

        return productDao.updateProduct(product);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public int delete(
            @PathVariable int id,
            Principal principal) {

        Product product = productDao.getProductById(id);

        if (product == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Product not found");
        }

        if (!canManage(product, principal)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You do not have permission to delete this product");
        }

        return productDao.deleteProduct(id);
    }

    private boolean canView(
            Product product,
            Principal principal) {

        if (product.isPublic()) {
            return true;
        }

        if (principal == null) {
            return false;
        }

        return product.getUsername().equals(principal.getName())
                || isAdmin(principal);
    }

    private boolean canManage(
            Product product,
            Principal principal) {

        if (principal == null) {
            return false;
        }

        return product.getUsername().equals(principal.getName())
                || isAdmin(principal);
    }

    private boolean isAdmin(Principal principal) {

        return userDao.getRoles(principal.getName())
                .contains("ADMIN");
    }
}