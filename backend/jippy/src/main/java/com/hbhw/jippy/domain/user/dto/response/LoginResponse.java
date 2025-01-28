package com.hbhw.jippy.domain.user.dto.response;

import com.hbhw.jippy.domain.user.entity.BaseUser;
import com.hbhw.jippy.domain.user.entity.UserOwner;
import com.hbhw.jippy.domain.user.enums.UserType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class LoginResponse {
    private Integer id;
    private String email;
    private String name;
    private String age;
    private UserType userType;
    private String accessToken;
    private String refreshToken;

    public static LoginResponse of(BaseUser user, String accessToken, String refreshToken) {
        LoginResponseBuilder builder = LoginResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .age(user.getAge())
                .userType(user instanceof UserOwner ? UserType.OWNER : UserType.STAFF)
                .accessToken(accessToken)
                .refreshToken(refreshToken);

        return builder.build();
    }
}
