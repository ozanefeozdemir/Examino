package com.example.examinoBack.repository;

import com.example.examinoBack.model.Role;
import com.example.examinoBack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String username);

    User findIdByEmail(String email);
    void deleteByEmail(String email);

    List<User> findAllByRole(Role role);
}
