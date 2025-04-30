package com.example.PasswordManager.service;

import com.example.PasswordManager.DAO.UserDAO;
import com.example.PasswordManager.VAO.PasswordEntry;
import com.example.PasswordManager.DAO.PasswordEntryDAO;
import com.example.PasswordManager.VAO.User;
import com.example.PasswordManager.util.VaultCryptoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PasswordEntryService {

    private final PasswordEntryDAO passwordEntryDAO;
    private final UserDAO userDAO;

    @Autowired
    public PasswordEntryService(PasswordEntryDAO passwordEntryDAO, UserDAO userDAO) {
        this.passwordEntryDAO = passwordEntryDAO;
        this.userDAO = userDAO;
    }

    public PasswordEntry createPasswordEntry(PasswordEntry passwordEntry, String userEmail, byte[] vaultKey) throws Exception {
        if (passwordEntry == null) {
            throw new IllegalArgumentException("PasswordEntry cannot be null.");
        }
        String encryptedPassword = VaultCryptoUtil.encrypt(passwordEntry.getSitePassword(), vaultKey);
        User user = userDAO.findByEmail(userEmail);
        passwordEntry.setSitePassword(encryptedPassword);
        passwordEntry.setUser(user);
        return passwordEntryDAO.save(passwordEntry);
    }

    public Optional<PasswordEntry> getPasswordEntryById(Long id, String userEmail, byte[] vaultKey) throws Exception {
        Optional<PasswordEntry> passwordEntry = passwordEntryDAO.findById(id)
                .filter(entry -> entry.getUser().getEmail().equals(userEmail));
        if (passwordEntry.isPresent()) {
            String decryptedPassword = VaultCryptoUtil.decrypt(passwordEntry.get().getSitePassword(), vaultKey);
            passwordEntry.get().setSitePassword(decryptedPassword);
        }
        return passwordEntry;
    }

    public List<PasswordEntry> getPasswordEntriesForUser(String userEmail, byte[] vaultKey) throws Exception {
        List<PasswordEntry> entries = passwordEntryDAO.findByUserEmail(userEmail);
        return entries.stream().map(entry -> {
            try {
                String decrypted = VaultCryptoUtil.decrypt(entry.getSitePassword(), vaultKey);
                entry.setSitePassword(decrypted);
                return entry;
            } catch (Exception e) {
                // handle decryption error (return null, skip, or custom logic)
                return null;
            }
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }

    public PasswordEntry updatePasswordEntry(Long id, PasswordEntry updated, String userEmail, byte[] vaultKey) throws Exception {
        PasswordEntry existingEntry = passwordEntryDAO.findById(id)
                .filter(entry -> entry.getUser().getEmail().equals(userEmail))
                .orElseThrow(() -> new IllegalArgumentException("Password entry not found or unauthorized."));

        existingEntry.setSiteName(updated.getSiteName());
        existingEntry.setSiteEmail(updated.getSiteEmail());

        // Encrypt new password before saving
        String encryptedPassword = VaultCryptoUtil.encrypt(updated.getSitePassword(), vaultKey);
        existingEntry.setSitePassword(encryptedPassword);

        return passwordEntryDAO.save(existingEntry);
    }

    public void deletePasswordEntry(Long id, String userEmail) {
        PasswordEntry entry = passwordEntryDAO.findById(id)
                .filter(e -> e.getUser().getEmail().equals(userEmail))
                .orElseThrow(() -> new IllegalArgumentException("Password entry not found or unauthorized."));
        passwordEntryDAO.delete(entry);
    }
}