package com.hbhw.jippy.domain.user.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_staff")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserStaff extends BaseUser {

}
