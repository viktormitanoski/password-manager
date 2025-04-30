package com.example.PasswordManager.util;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Response {

    private final String token;
    private final String vaultKey;
}