package com.hbhw.jippy.domain.user.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class TokenResponse {
    private String accessToken;

    public static TokenResponse of(String accessToken) {
        return new TokenResponse(accessToken);
    }
}
