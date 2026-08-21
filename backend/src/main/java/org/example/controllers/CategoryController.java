package org.example.controllers;

import org.example.daos.CategoryDao;
import org.example.daos.UserDao;
import org.example.models.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryDao categoryDao;

    @Autowired
    private UserDao userDao;

    @GetMapping
    @PreAuthorize("permitAll()")
    public List<Category> getAll(Principal principal) {

        List<Category> categories = categoryDao.getCategories();

        return categories.stream()
                .filter(category -> canView(category, principal))
                .toList();
    }

    @GetMapping("/sort")
    @PreAuthorize("permitAll()")
    public List<Category> sort(
            @RequestParam String sortBy,
            @RequestParam String direction,
            Principal principal) {

        return categoryDao
                .getCategoriesSorted(sortBy, direction)
                .stream()
                .filter(category -> canView(category, principal))
                .toList();
    }

    @GetMapping("/search")
    @PreAuthorize("permitAll()")
    public List<Category> search(
            @RequestParam String name,
            @RequestParam String username,
            Principal principal) {

        return categoryDao.searchCategories(name, username)
                .stream()
                .filter(category -> canView(category, principal))
                .toList();
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public Category getById(
            @PathVariable int id,
            Principal principal) {

        Category category = categoryDao.getCategoryById(id);

        if (category == null || !canView(category, principal)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Category not found");
        }

        return category;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    public Category create(
            @RequestBody Category category,
            Principal principal) {

        category.setUsername(principal.getName());

        return categoryDao.createCategory(category);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public Category update(
            @PathVariable int id,
            @RequestBody Category category,
            Principal principal) {

        Category existingCategory = categoryDao.getCategoryById(id);

        if (existingCategory == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Category not found");
        }

        if (!canManage(existingCategory, principal)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You do not have permission to edit this category");
        }

        category.setId(id);
        category.setUsername(existingCategory.getUsername());

        return categoryDao.updateCategory(category);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public int delete(
            @PathVariable int id,
            Principal principal) {

        Category category = categoryDao.getCategoryById(id);

        if (category == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Category not found");
        }

        if (!canManage(category, principal)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You do not have permission to delete this category");
        }

        return categoryDao.deleteCategory(id);
    }

    private boolean canView(
            Category category,
            Principal principal) {

        if (category.isPublic()) {
            return true;
        }

        if (principal == null) {
            return false;
        }

        return category.getUsername().equals(principal.getName())
                || isAdmin(principal);
    }

    private boolean canManage(
            Category category,
            Principal principal) {

        if (principal == null) {
            return false;
        }

        return category.getUsername().equals(principal.getName())
                || isAdmin(principal);
    }

    private boolean isAdmin(Principal principal) {

        return userDao.getRoles(principal.getName())
                .contains("ADMIN");
    }
}