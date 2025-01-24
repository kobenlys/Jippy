package com.hbhw.jippy.domain.user.entity;

import com.hbhw.jippy.utils.converter.StaffTypeConverter;
import com.hbhw.jippy.domain.user.enumeration.StaffType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
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
    @Convert(converter = StaffTypeConverter.class)
    @Column(name = "staff_type", nullable = false)
    private StaffType staffType;

    @Builder
    public UserOwner(String email, String password, String name, String age, StaffType staffType) {
        super(email, password, name, age);
        this.staffType = staffType;
    }
}
