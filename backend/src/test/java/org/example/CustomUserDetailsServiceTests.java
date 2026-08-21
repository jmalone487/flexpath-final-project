package org.example;

import org.example.daos.UserDao;
import org.example.models.User;
import org.example.services.CustomUserDetailsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CustomUserDetailsServiceTests {

    private UserDao userDao;
    private CustomUserDetailsService service;

    @BeforeEach
    void setUp() {
        userDao = mock(UserDao.class);
        service = new CustomUserDetailsService(userDao);
    }

    @Test
    void loadUserByUsernameReturnsUserDetails() {
        User user = new User(
                "testuser",
                "hashedPassword");

        when(userDao.getUserByUsername("testuser"))
                .thenReturn(user);

        when(userDao.getRoles("testuser"))
                .thenReturn(List.of("USER"));

        UserDetails result = service.loadUserByUsername("testuser");

        assertEquals(
                "testuser",
                result.getUsername());

        assertEquals(
                "hashedPassword",
                result.getPassword());

        assertTrue(result.isEnabled());
        assertTrue(result.isAccountNonExpired());
        assertTrue(result.isAccountNonLocked());
        assertTrue(result.isCredentialsNonExpired());

        assertEquals(
                1,
                result.getAuthorities().size());

        assertEquals(
                "USER",
                result.getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority());
    }

    @Test
    void loadUserByUsernameThrowsWhenUserMissing() {
        when(userDao.getUserByUsername("missing"))
                .thenReturn(null);

        assertThrows(
                UsernameNotFoundException.class,
                () -> service.loadUserByUsername("missing"));
    }

    @Test
    void loadUserByUsernameHandlesMultipleRoles() {
        User user = new User(
                "admin",
                "hashedPassword");

        when(userDao.getUserByUsername("admin"))
                .thenReturn(user);

        when(userDao.getRoles("admin"))
                .thenReturn(
                        List.of(
                                "USER",
                                "ADMIN"));

        UserDetails result = service.loadUserByUsername("admin");

        assertEquals(
                2,
                result.getAuthorities().size());
    }
}
