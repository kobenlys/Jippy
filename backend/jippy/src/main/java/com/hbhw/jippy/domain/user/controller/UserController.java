package com.hbhw.jippy.domain.user.controller;

import com.hbhw.jippy.domain.user.dto.request.SignUpRequest;
import com.hbhw.jippy.domain.user.dto.response.SignUpResponse;
import com.hbhw.jippy.domain.user.enumeration.UserType;
import com.hbhw.jippy.domain.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/signup/owner")
    public ResponseEntity<SignUpResponse> ownerSignUp(@RequestBody @Valid SignUpRequest request) {
        SignUpResponse response = userService.signUp(request, UserType.OWNER);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/signup/staff")
    public ResponseEntity<SignUpResponse> staffSignUp(@RequestBody @Valid SignUpRequest request) {
        SignUpResponse response = userService.signUp(request, UserType.STAFF);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
