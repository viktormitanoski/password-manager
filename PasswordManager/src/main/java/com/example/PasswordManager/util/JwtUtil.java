package com.example.PasswordManager.util;

import com.example.PasswordManager.config.JwtConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private final JwtConfig jwtConfig;

    public JwtUtil(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    // Method to generate a JWT token
    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour expiry
                .signWith(getSigningKey(jwtConfig.getSecretKey()), Jwts.SIG.HS256) // Explicitly specify HS256
                .compact();
    }

    // Method to extract email (subject) from the token
    public String extractEmail(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey(jwtConfig.getSecretKey()))
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claims.getSubject();
        } catch (JwtException e) {
            // Fallback to previous key if current key fails
            try {
                Claims claims = Jwts.parser()
                        .verifyWith(getSigningKey(jwtConfig.getPreviousSecretKey()))
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();
                return claims.getSubject();
            } catch (JwtException ex) {
                throw new IllegalArgumentException("Invalid JWT token", ex);
            }
        }
    }

    // Method to validate token
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey(jwtConfig.getSecretKey()))
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            // Fallback to previous key
            try {
                Jwts.parser()
                        .verifyWith(getSigningKey(jwtConfig.getPreviousSecretKey()))
                        .build()
                        .parseSignedClaims(token);
                return true;
            } catch (JwtException ex) {
                return false;
            }
        }
    }

    // Helper method to create a SecretKey from the provided key string
    private SecretKey getSigningKey(String key) {
        if (key == null || key.isEmpty()) {
            throw new IllegalStateException("JWT secret key cannot be null or empty");
        }
        return Keys.hmacShaKeyFor(key.getBytes(StandardCharsets.UTF_8));
    }
}