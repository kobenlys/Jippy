package com.hbhw.jippy.domain.user.service;

import com.hbhw.jippy.domain.user.dto.request.*;
import com.hbhw.jippy.domain.user.dto.response.LoginResponse;
import com.hbhw.jippy.domain.user.dto.response.UpdateUserResponse;
import com.hbhw.jippy.domain.user.entity.BaseUser;
import com.hbhw.jippy.domain.user.entity.UserOwner;
import com.hbhw.jippy.domain.user.entity.UserStaff;
import com.hbhw.jippy.domain.user.enums.UserType;
import com.hbhw.jippy.domain.user.factory.UserFactory;
import com.hbhw.jippy.domain.user.repository.UserOwnerRepository;
import com.hbhw.jippy.domain.user.repository.UserStaffRepository;
import com.hbhw.jippy.global.auth.JwtProvider;
import com.hbhw.jippy.global.auth.RefreshToken;
import com.hbhw.jippy.global.auth.RefreshTokenRepository;
import com.hbhw.jippy.global.auth.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserOwnerRepository userOwnerRepository;
    private final UserFactory userFactory;
    private final UserStaffRepository userStaffRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh.expiration}")
    private Long refreshTokenExpireTime;

    @Transactional
    public void signUp(SignUpRequest request, UserType userType) {
        switch (userType) {
            case OWNER -> {
                if (userOwnerRepository.existsByEmail(request.getEmail())) {
                    throw new RuntimeException("이미 사용 중인 이메일입니다.");
                }
            }

            case STAFF -> {
                if (userStaffRepository.existsByEmail(request.getEmail())) {
                    throw new RuntimeException("이미 사용 중인 이메일입니다.");
                }
            }
        }

        BaseUser newUser = userFactory.createUser(request, userType);

        switch (userType) {
            case OWNER -> userOwnerRepository.save((UserOwner) newUser);
            case STAFF -> userStaffRepository.save((UserStaff) newUser);
        }
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        BaseUser user = findUser(request.getEmail(), request.getUserType());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        UserPrincipal principal = new UserPrincipal(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = jwtProvider.createAccessToken(authentication);
        String refreshToken = jwtProvider.createRefreshToken(user.getEmail());

        RefreshToken redisRefreshToken = RefreshToken.builder()
                .id(user.getEmail())
                .token(refreshToken)
                .userType(request.getUserType().name())
                .ttl(refreshTokenExpireTime / 1000)
                .build();

        refreshTokenRepository.save(redisRefreshToken);

        /**
         * redis 저장 확인용
         */
        RefreshToken savedToken = refreshTokenRepository.findById(redisRefreshToken.getId())
                .orElse(null);
        log.info("Redis에 저장된 값: " + savedToken);

        return LoginResponse.of(user, accessToken, refreshToken);
    }

    @Transactional
    public void logout() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        refreshTokenRepository.deleteById(principal.getEmail());
        SecurityContextHolder.clearContext();
    }

    @Transactional
    public void deleteUser() {
        BaseUser user = getCurrentUser();
        String deleteUserName = user.getName() + " (탈퇴)";
        user.updateInfo(deleteUserName, user.getAge());
        logout();
    }

    @Transactional
    public UpdateUserResponse updateUser(UpdateUserRequest request) {
        BaseUser user = getCurrentUser();
        user.updateInfo(request.getName(), request.getAge());
        return UpdateUserResponse.of(user);
    }

    @Transactional
    public void updatePassword(UpdatePasswordRequest request) {
        BaseUser user = getCurrentUser();
        user.updatePassword(passwordEncoder.encode(request.getNewPassword()));
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        BaseUser user = findUser(request.getEmail(), request.getUserType());
        String tempPassword = generateTempPassword();

        try {
            emailService.sendTempPassword(user.getName(), user.getEmail(), tempPassword);
            user.updatePassword(passwordEncoder.encode(tempPassword));
        } catch (Exception e) {
            throw new RuntimeException("이메일 발송 실패");
        }
    }

    /**
     * 사용자 조회 메서드
     */
    private BaseUser findUser(String email, UserType userType) {
        return switch (userType) {
            case OWNER -> userOwnerRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("존재하지 않는 점주입니다."));
            case STAFF -> userStaffRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("존재하지 않는 직원입니다."));
        };
    }

    /**
     * 현재 인증된 사용자 조회 메서드
     */
    private BaseUser getCurrentUser() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return findUser(principal.getEmail(), principal.getUserType());
    }

    private String generateTempPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();

        sb.append("A").append("a").append("1").append("!");

        for (int i = 0; i < 8; i++) {
            int index = random.nextInt(chars.length());
            sb.append(chars.charAt(index));
        }

        char[] password = sb.toString().toCharArray();
        for (int i = password.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char temp = password[i];
            password[i] = password[j];
            password[j] = temp;
        }

        return new String(password);
    }
}
