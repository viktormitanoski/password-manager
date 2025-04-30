package com.example.PasswordManager.service;

import com.example.PasswordManager.VAO.User;
import com.example.PasswordManager.DAO.UserDAO;
import com.example.PasswordManager.util.VaultKeyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserDAO userDAO;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserDAO userDAO, PasswordEncoder passwordEncoder) {
        this.userDAO = userDAO;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(User user) throws IllegalArgumentException {
        if (user.getPassword() == null) {
            throw new IllegalArgumentException("Password is required");
        }
        user.setSalt(VaultKeyUtil.generateSalt());
        user.setPassword(passwordEncoder.encode(user.getPassword())); // <- Now works
        return userDAO.save(user);
    }

    public Optional<User> getUserByEmail(String email) throws IllegalArgumentException {
        if (email == null) {
            throw new IllegalArgumentException("Email is required");
        }
        return Optional.ofNullable(userDAO.findByEmail(email));
    }

    public List<User> getAllUsers() {
        return userDAO.findAll();
    }


    public void deleteUserByEmail(String email) throws IllegalArgumentException {
        if (!userDAO.existsByEmail(email)) {
            throw new IllegalArgumentException("User with given email does not exist.");
        }
        userDAO.deleteByEmail(email);
    }
}