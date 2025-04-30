package com.example.PasswordManager.util;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

public class VaultCryptoUtil {

    private static final String ALGORITHM = "AES/CBC/PKCS5Padding";

    public static String encrypt(String data, byte[] key) throws Exception {
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        byte[] iv = new byte[16];
        new SecureRandom().nextBytes(iv); // random IV
        IvParameterSpec ivSpec = new IvParameterSpec(iv);
        SecretKeySpec keySpec = new SecretKeySpec(key, "AES");

        cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec);
        byte[] encrypted = cipher.doFinal(data.getBytes());

        // Prepend IV to ciphertext
        byte[] ivAndEncrypted = new byte[iv.length + encrypted.length];
        System.arraycopy(iv, 0, ivAndEncrypted, 0, iv.length);
        System.arraycopy(encrypted, 0, ivAndEncrypted, iv.length, encrypted.length);

        return Base64.getEncoder().encodeToString(ivAndEncrypted);
    }

    public static String decrypt(String encryptedData, byte[] key) throws Exception {
        byte[] ivAndEncrypted = Base64.getDecoder().decode(encryptedData);
        byte[] iv = new byte[16];
        byte[] encrypted = new byte[ivAndEncrypted.length - 16];

        System.arraycopy(ivAndEncrypted, 0, iv, 0, 16);
        System.arraycopy(ivAndEncrypted, 16, encrypted, 0, encrypted.length);

        Cipher cipher = Cipher.getInstance(ALGORITHM);
        IvParameterSpec ivSpec = new IvParameterSpec(iv);
        SecretKeySpec keySpec = new SecretKeySpec(key, "AES");

        cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);
        byte[] decrypted = cipher.doFinal(encrypted);

        return new String(decrypted);
    }
}