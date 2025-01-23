package com.hbhw.jippy.domain.user.service;

import com.hbhw.jippy.domain.user.dto.request.SignUpRequest;
import com.hbhw.jippy.domain.user.dto.response.SignUpResponse;
import com.hbhw.jippy.domain.user.enumeration.UserType;

public interface UserService {
    SignUpResponse signUp(SignUpRequest request, UserType userType);
}
