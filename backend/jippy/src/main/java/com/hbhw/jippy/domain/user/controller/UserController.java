package com.hbhw.jippy.domain.user.controller;

import com.hbhw.jippy.domain.user.dto.request.LoginRequest;
import com.hbhw.jippy.domain.user.dto.request.SignUpRequest;
import com.hbhw.jippy.domain.user.dto.response.LoginResponse;
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
    public ResponseEntity<?> ownerSignUp(@RequestBody @Valid SignUpRequest request) {
        userService.signUp(request, UserType.OWNER);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/signup/staff")
    public ResponseEntity<?> staffSignUp(@RequestBody @Valid SignUpRequest request) {
        userService.signUp(request, UserType.STAFF);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }
}
