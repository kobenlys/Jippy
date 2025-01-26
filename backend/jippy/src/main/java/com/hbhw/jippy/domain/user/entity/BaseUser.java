package com.hbhw.jippy.domain.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@MappedSuperclass
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public abstract class BaseUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 80)
    private String password;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 15)
    private String age;

    @Column(name = "created_at", nullable = false, length = 20)
    private String createdAt;

    protected BaseUser(String email, String password, String name, String age) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.age = age;
        this.createdAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    public void updateInfo(String name, String age) {
        if (name != null) {
            this.name = name;
        }
        if (age != null) {
            this.age = age;
        }
    }

    public void updatePassword(String newPassword) {
        this.password = newPassword;
    }
}
