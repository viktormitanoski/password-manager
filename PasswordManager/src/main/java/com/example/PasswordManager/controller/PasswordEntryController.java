package com.example.PasswordManager.controller;

import com.example.PasswordManager.VAO.PasswordEntry;
import com.example.PasswordManager.service.PasswordEntryService;
import com.example.PasswordManager.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;

@RestController
@RequestMapping("/password-entries")
public class PasswordEntryController {

    private final PasswordEntryService passwordEntryService;
    private final JwtUtil jwtUtil;

    @Autowired
    public PasswordEntryController(PasswordEntryService passwordEntryService, JwtUtil jwtUtil) {
        this.passwordEntryService = passwordEntryService;
        this.jwtUtil = jwtUtil;
    }

    private byte[] decodeVaultKey(String encodedKey) {
        return Base64.getDecoder().decode(encodedKey);
    }

    @PostMapping
    public ResponseEntity<?> createPasswordEntry(
            @RequestBody PasswordEntry passwordEntry,
            @RequestHeader("Authorization") String authHeader,
            @RequestHeader("Vault-Key") String encodedVaultKey) {
        try {
            String email = jwtUtil.extractEmail(authHeader);
            byte[] vaultKey = decodeVaultKey(encodedVaultKey);

            PasswordEntry created = passwordEntryService.createPasswordEntry(passwordEntry, email, vaultKey);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create password entry.");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPasswordEntryById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader,
            @RequestHeader("Vault-Key") String encodedVaultKey) {
        try {
            String email = jwtUtil.extractEmail(authHeader);
            byte[] vaultKey = decodeVaultKey(encodedVaultKey);
            return passwordEntryService.getPasswordEntryById(id, email, vaultKey)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve password entry.");
        }
    }

    @GetMapping
    public ResponseEntity<?> getPasswordEntries(
            @RequestHeader("Authorization") String authHeader,
            @RequestHeader("Vault-Key") String encodedVaultKey) {
        try {
            String email = jwtUtil.extractEmail(authHeader);
            byte[] vaultKey = decodeVaultKey(encodedVaultKey);
            return ResponseEntity.ok(passwordEntryService.getPasswordEntriesForUser(email, vaultKey));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve entries.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePasswordEntry(
            @PathVariable Long id,
            @RequestBody PasswordEntry entry,
            @RequestHeader("Authorization") String authHeader,
            @RequestHeader("Vault-Key") String encodedVaultKey) {
        try {
            String email = jwtUtil.extractEmail(authHeader);
            byte[] vaultKey = decodeVaultKey(encodedVaultKey);
            return ResponseEntity.ok(passwordEntryService.updatePasswordEntry(id, entry, email, vaultKey));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update password entry.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePasswordEntry(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String email = jwtUtil.extractEmail(authHeader);
            passwordEntryService.deletePasswordEntry(id, email);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete password entry.");
        }
    }
}