package com.example.PasswordManager.VAO;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "password_entries")
public class PasswordEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String siteName;
    private String siteEmail;
    private String sitePassword;
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public String getSiteEmail() {
        return siteEmail;
    }

    public void setSiteEmail(String siteEmail) {
        this.siteEmail = siteEmail;
    }

    public String getSitePassword() {
        return sitePassword;
    }

    public void setSitePassword(String sitePassword) {
        this.sitePassword = sitePassword;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @ManyToOne
    @JoinColumn(name = "user_email", referencedColumnName = "email", nullable = false)
    @JsonBackReference
    private User user;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

}