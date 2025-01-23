package com.hbhw.jippy.domain.user.factory;

import com.hbhw.jippy.domain.user.dto.request.SignUpRequest;
import com.hbhw.jippy.domain.user.entity.BaseUser;
import com.hbhw.jippy.domain.user.entity.UserOwner;
import com.hbhw.jippy.domain.user.entity.UserStaff;
import com.hbhw.jippy.domain.user.enumeration.StaffType;
import com.hbhw.jippy.domain.user.enumeration.UserType;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserFactory {
    private final PasswordEncoder passwordEncoder;

    public BaseUser createUser(SignUpRequest request, UserType userType) {
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        return switch (userType) {
            case OWNER -> UserOwner.builder()
                    .email(request.getEmail())
                    .password(encodedPassword)
                    .name(request.getName())
                    .age(request.getAge())
                    .staffType(StaffType.사장)
                    .build();

            case STAFF -> UserStaff.builder()
                    .email(request.getEmail())
                    .password(encodedPassword)
                    .name(request.getName())
                    .age(request.getAge())
                    .build();
        };
    }
}
