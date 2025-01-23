package com.hbhw.jippy.domain.user.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_owner")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserOwner extends BaseUser {
    @Builder
    public UserOwner(String email, String password, String name, Integer age) {
        super(email, password, name, age);
    }
}
