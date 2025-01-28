package com.hbhw.jippy.global.auth;

import com.hbhw.jippy.domain.user.dto.response.TokenResponse;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class TokenController {
    private final JwtProvider jwtProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final CustomUserDetailsService userDetailsService;

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@RequestHeader("Authorization") String refreshToken) {
        refreshToken = refreshToken.substring(7);

        try {
            Claims claims = jwtProvider.validateTokenAndGetClaims(refreshToken);

            RefreshToken redisRefreshToken = refreshTokenRepository.findById(claims.getSubject())
                    .orElseThrow(() -> new RuntimeException("저장된 Refresh Token이 없습니다."));

            if (!redisRefreshToken.getToken().equals(refreshToken)) {
                throw new RuntimeException("Refresh Token이 일치하지 않습니다.");
            }

            UserDetails userDetails = userDetailsService.loadUserByUsername(redisRefreshToken.getId() + ":" + redisRefreshToken.getUserType());
            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

            String newAccessToken = jwtProvider.createAccessToken(authentication);

            return ResponseEntity.ok(TokenResponse.of(newAccessToken));
        } catch (Exception e) {
            throw new RuntimeException("토큰 갱신 실패: " + e.getMessage());
        }
    }
}
