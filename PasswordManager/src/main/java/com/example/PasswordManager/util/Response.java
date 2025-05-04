package com.example.PasswordManager.util;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class Response {

    private final String token;
    private final String vaultKey;

    public String getToken() {
        return token;
    }

    public String getVaultKey() {
        return vaultKey;
    }

    public Response(String token, String vaultKey) {
        this.token = token;
        this.vaultKey = vaultKey;
    }
}