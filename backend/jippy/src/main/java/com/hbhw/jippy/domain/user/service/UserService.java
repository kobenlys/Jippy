package com.hbhw.jippy.domain.user.service;

import com.hbhw.jippy.domain.user.dto.request.LoginRequest;
import com.hbhw.jippy.domain.user.dto.request.SignUpRequest;
import com.hbhw.jippy.domain.user.dto.request.UpdatePasswordRequest;
import com.hbhw.jippy.domain.user.dto.request.UpdateUserRequest;
import com.hbhw.jippy.domain.user.dto.response.LoginResponse;
import com.hbhw.jippy.domain.user.dto.response.UpdateUserResponse;
import com.hbhw.jippy.domain.user.entity.BaseUser;
import com.hbhw.jippy.domain.user.entity.UserOwner;
import com.hbhw.jippy.domain.user.entity.UserStaff;
import com.hbhw.jippy.domain.user.enumeration.UserType;
import com.hbhw.jippy.domain.user.factory.UserFactory;
import com.hbhw.jippy.domain.user.repository.UserOwnerRepository;
import com.hbhw.jippy.domain.user.repository.UserStaffRepository;
import com.hbhw.jippy.global.auth.JwtProvider;
import com.hbhw.jippy.global.auth.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserOwnerRepository userOwnerRepository;
    private final UserFactory userFactory;
    private final UserStaffRepository userStaffRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;

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
        BaseUser user = switch (request.getUserType()) {
            case OWNER -> userOwnerRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("존재하지 않는 점주입니다."));
            case STAFF -> userStaffRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("존재하지 않는 직원입니다."));
        };

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        UserPrincipal principal = new UserPrincipal(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = jwtProvider.createAccessToken(authentication);
        String refreshToken = jwtProvider.createRefreshToken();

        return LoginResponse.of(user, accessToken, refreshToken);
    }

    @Transactional
    public UpdateUserResponse updateUser(UpdateUserRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        BaseUser user = switch (principal.getUserType()) {
            case OWNER -> userOwnerRepository.findByEmail(principal.getEmail())
                    .orElseThrow(() -> new RuntimeException("존재하지 않는 점주입니다."));
            case STAFF -> userStaffRepository.findByEmail(principal.getEmail())
                    .orElseThrow(() -> new RuntimeException("존재하지 않는 직원입니다."));
        };

        user.updateInfo(request.getName(), request.getAge());
        return UpdateUserResponse.of(user);
    }

    @Transactional
    public void updatePassword(UpdatePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        BaseUser user = switch (principal.getUserType()) {
            case OWNER -> userOwnerRepository.findByEmail(principal.getEmail())
                    .orElseThrow(() -> new RuntimeException("존재하지 않는 점주입니다."));
            case STAFF -> userStaffRepository.findByEmail(principal.getEmail())
                    .orElseThrow(() -> new RuntimeException("존재하지 않는 직원입니다."));
        };

        user.updatePassword(passwordEncoder.encode(request.getNewPassword()));
    }
}
