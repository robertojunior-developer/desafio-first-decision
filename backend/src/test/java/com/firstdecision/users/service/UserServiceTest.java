package com.firstdecision.users.service;

import com.firstdecision.users.api.dto.UserRequest;
import com.firstdecision.users.domain.User;
import com.firstdecision.users.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    private UserRepository repository;
    private BCryptPasswordEncoder encoder;
    private UserService service;

    @BeforeEach
    void setup() {
        repository = Mockito.mock(UserRepository.class);
        encoder = new BCryptPasswordEncoder();
        service = new UserService(repository, encoder);
    }

    @Test
    void shouldThrowWhenPasswordsDoNotMatch() {
        UserRequest req = new UserRequest();
        req.setName("Alice");
        req.setEmail("alice@example.com");
        req.setPassword("secret123");
        req.setConfirmPassword("secret12");
        assertThrows(PasswordMismatchException.class, () -> service.create(req));
    }

    @Test
    void shouldThrowWhenEmailAlreadyUsed() {
        when(repository.existsByEmailIgnoreCase("alice@example.com")).thenReturn(true);
        UserRequest req = new UserRequest();
        req.setName("Alice");
        req.setEmail("alice@example.com");
        req.setPassword("secret123");
        req.setConfirmPassword("secret123");
        assertThrows(EmailAlreadyUsedException.class, () -> service.create(req));
    }

    @Test
    void shouldHashPasswordOnCreate() {
        when(repository.existsByEmailIgnoreCase(anyString())).thenReturn(false);
        when(repository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        UserRequest req = new UserRequest();
        req.setName("Alice");
        req.setEmail("alice@example.com");
        req.setPassword("secret123");
        req.setConfirmPassword("secret123");

        service.create(req);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(repository).save(captor.capture());
        User saved = captor.getValue();
        assertNotNull(saved.getPasswordHash());
        assertNotEquals("secret123", saved.getPasswordHash());
        assertTrue(encoder.matches("secret123", saved.getPasswordHash()));
    }
}
