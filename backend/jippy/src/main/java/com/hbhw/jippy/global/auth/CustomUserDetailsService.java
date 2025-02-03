package com.hbhw.jippy.global.auth;

import com.hbhw.jippy.domain.user.entity.BaseUser;
import com.hbhw.jippy.domain.user.enums.UserType;
import com.hbhw.jippy.domain.user.repository.UserOwnerRepository;
import com.hbhw.jippy.domain.user.repository.UserStaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * 사용자 정보를 로드하는 서비스
 * - Spring Security의 UserDetailsService 구현
 * - DB에서 사용자 정보를 조회하여 UserDetails 객체로 변환
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserOwnerRepository userOwnerRepository;
    private final UserStaffRepository userStaffRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        String[] parts = email.split(":");
        String userEmail = parts[0];
        UserType userType = UserType.valueOf(parts[1]);

        BaseUser user = switch (userType) {
            case OWNER -> userOwnerRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("존재하지 않는 점주입니다."));
            case STAFF -> userStaffRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("존재하지 않는 직원입니다."));
        };

        return new UserPrincipal(user);
    }
}
