package com.hbhw.jippy.domain.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    @Column(nullable = false)
    private Integer age;

    @Column(name = "created_at", nullable = false, length = 15)
    private String createAt;



}
