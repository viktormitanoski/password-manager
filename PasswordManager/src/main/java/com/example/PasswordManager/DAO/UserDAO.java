package com.example.PasswordManager.DAO;

import com.example.PasswordManager.VAO.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDAO extends JpaRepository<User, Long> {

    User findByEmail(String email);
    boolean existsByEmail(String email);
    void deleteByEmail(String email);
}