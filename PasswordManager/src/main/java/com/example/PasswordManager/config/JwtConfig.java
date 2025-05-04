package com.example.PasswordManager.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "jwt")
@Getter
@Setter
public class JwtConfig {

    private String secretKey;
    private String previousSecretKey;

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public String getPreviousSecretKey() {
        return previousSecretKey;
    }

    public void setPreviousSecretKey(String previousSecretKey) {
        this.previousSecretKey = previousSecretKey;
    }
}