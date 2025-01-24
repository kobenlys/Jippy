package com.hbhw.jippy.domain.user.dto.response;

import com.hbhw.jippy.domain.user.entity.BaseUser;
import com.hbhw.jippy.domain.user.entity.UserOwner;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SignUpResponse {
    private Integer id;
    private String email;
    private String name;
    private String birthDate;
    private String staffType;
    private String createdAt;

    public static SignUpResponse from(BaseUser user) {
        return new SignUpResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getBirthDate(),
                user instanceof UserOwner ? "점주" : "직원",
                user.getCreatedAt()
        );
    }
}
