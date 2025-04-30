package com.example.PasswordManager.DAO;

import com.example.PasswordManager.VAO.PasswordEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PasswordEntryDAO extends JpaRepository<PasswordEntry, Long> {

    List<PasswordEntry> findByUserEmail(String userEmail);
}