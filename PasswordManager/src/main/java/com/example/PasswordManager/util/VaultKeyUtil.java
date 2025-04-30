package com.example.PasswordManager.util;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

public class VaultKeyUtil {

    private static final int SALT_LENGTH = 16;
    private static final int ITERATIONS = 100_000;
    private static final int KEY_LENGTH = 256; // bits

    public static String generateSalt() {
        byte[] salt = new byte[SALT_LENGTH];
        new SecureRandom().nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    public static byte[] deriveKey(String password, String base64Salt) throws Exception {
        byte[] salt = Base64.getDecoder().decode(base64Salt);
        PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, ITERATIONS, KEY_LENGTH);
        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        return factory.generateSecret(spec).getEncoded();
    }
}