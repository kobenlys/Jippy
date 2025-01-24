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

    @Column(name = "birth_date", nullable = false, length = 10)
    private String birthDate;

    @Column(name = "created_at", nullable = false, length = 19)
    private String createdAt;

    protected BaseUser(String email, String password, String name, String birthDate) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.birthDate = birthDate;
        this.createdAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
}
