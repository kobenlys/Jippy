package com.hbhw.jippy.global.auth;

import com.hbhw.jippy.utils.DateTimeUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

/**
 * JWT 토큰 생성 및 검증 클래스
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtProvider {
    @Value("${jwt.secret.key}")
    private String secretKey;

    @Value("${jwt.access.expiration}")
    private Long accessTokenExpireTime;

    @Value("${jwt.refresh.expiration}")
    private Long refreshTokenExpireTime;

    private SecretKey key;
    @PostConstruct  // 객체 생성 시 단 한 번만 키 생성
    protected void init() {
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public String createAccessToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        String token = Jwts.builder()
                .subject(userPrincipal.getEmail())
                .claim("id", userPrincipal.getId())
                .claim("userType", userPrincipal.getUserType().name())
                .issuedAt(DateTimeUtils.now())
                .expiration(DateTimeUtils.getExpirationTime(accessTokenExpireTime))
                .signWith(key)
                .compact();

        log.info("Access token 생성 완료: {}", token);
        return token;
    }

    public String createRefreshToken() {
        String token = Jwts.builder()
                .issuedAt(DateTimeUtils.now())
                .expiration(DateTimeUtils.getExpirationTime(refreshTokenExpireTime))
                .signWith(key)
                .compact();

        log.info("Refresh token 생성 완료: {}", token);
        return token;
    }

    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }
}
