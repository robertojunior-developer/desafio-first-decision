package com.firstdecision.users.service;

import com.firstdecision.users.api.dto.UserRequest;
import com.firstdecision.users.api.dto.UserResponse;
import com.firstdecision.users.domain.User;
import com.firstdecision.users.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse create(UserRequest req) {
        validatePasswords(req.getPassword(), req.getConfirmPassword());
        if (repository.existsByEmailIgnoreCase(req.getEmail())) {
            throw new EmailAlreadyUsedException("E-mail já cadastrado");
        }
        User u = new User();
        u.setName(req.getName());
        u.setEmail(req.getEmail().toLowerCase());
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        u.setCreatedAt(OffsetDateTime.now());
        User saved = repository.save(u);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> list() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public UserResponse get(UUID id) {
        User u = repository.findById(id).orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));
        return toResponse(u);
    }

    @Transactional
    public UserResponse update(UUID id, UserRequest req) {
        validatePasswords(req.getPassword(), req.getConfirmPassword());
        User u = repository.findById(id).orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));
        if (!u.getEmail().equalsIgnoreCase(req.getEmail()) && repository.existsByEmailIgnoreCase(req.getEmail())) {
            throw new EmailAlreadyUsedException("E-mail já cadastrado");
        }
        u.setName(req.getName());
        u.setEmail(req.getEmail().toLowerCase());
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        User saved = repository.save(u);
        return toResponse(saved);
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new UserNotFoundException("Usuário não encontrado");
        }
        repository.deleteById(id);
    }

    private void validatePasswords(String p, String c) {
        if (p == null || c == null || !p.equals(c)) {
            throw new PasswordMismatchException("Senha e confirmação não conferem");
        }
    }

    private UserResponse toResponse(User u) {
        return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getCreatedAt());
    }
}
