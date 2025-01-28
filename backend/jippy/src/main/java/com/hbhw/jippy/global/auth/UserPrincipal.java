package com.hbhw.jippy.global.auth;

import com.hbhw.jippy.domain.user.entity.BaseUser;
import com.hbhw.jippy.domain.user.entity.UserOwner;
import com.hbhw.jippy.domain.user.enums.UserType;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * 인증된 사용자 정보를 담는 클래스
 * - Spring Security의 UserDetails 인터페이스 구현
 * - User 엔티티와 Spring Security 연결
 */
@Getter
public class UserPrincipal implements UserDetails {
    private final Integer id;
    private final String email;
    private final String password;
    private final String name;
    private final String age;
    private final UserType userType;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(BaseUser user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.name = user.getName();
        this.age = user.getAge();
        this.userType = user instanceof UserOwner ? UserType.OWNER : UserType.STAFF;
        this.authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + this.userType.name())
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
