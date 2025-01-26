package com.hbhw.jippy.domain.user.dto.response;

import com.hbhw.jippy.domain.user.entity.BaseUser;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class UpdateUserResponse {
    private String name;
    private String age;

    public static UpdateUserResponse of(BaseUser user) {
        return UpdateUserResponse.builder()
                .name(user.getName())
                .age(user.getAge())
                .build();
    }
}
