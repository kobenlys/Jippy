package com.hbhw.jippy.domain.user.service;

import com.hbhw.jippy.domain.user.dto.request.SignUpRequest;
import com.hbhw.jippy.domain.user.dto.response.SignUpResponse;
import com.hbhw.jippy.domain.user.entity.BaseUser;
import com.hbhw.jippy.domain.user.entity.UserOwner;
import com.hbhw.jippy.domain.user.entity.UserStaff;
import com.hbhw.jippy.domain.user.enumeration.UserType;
import com.hbhw.jippy.domain.user.factory.UserFactory;
import com.hbhw.jippy.domain.user.repository.UserOwnerRepository;
import com.hbhw.jippy.domain.user.repository.UserStaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserOwnerRepository userOwnerRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserFactory userFactory;
    private final UserStaffRepository userStaffRepository;

    @Override
    @Transactional
    public SignUpResponse signUp(SignUpRequest request, UserType userType) {
        if (userOwnerRepository.existsByEmail(request.getEmail()) ||
            userStaffRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        BaseUser newUser = userFactory.createUser(request, userType);

        BaseUser savedUser = switch (userType) {
            case OWNER -> userOwnerRepository.save((UserOwner) newUser);
            case STAFF -> userStaffRepository.save((UserStaff) newUser);
        };

        return SignUpResponse.from(savedUser);
    }
}
