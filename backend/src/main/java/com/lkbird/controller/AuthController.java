package com.lkbird.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lkbird.dto.request.LoginRequest;
import com.lkbird.dto.request.LogoutRequest;
import com.lkbird.dto.request.RefreshRequest;
import com.lkbird.dto.response.LoginResponse;
import com.lkbird.dto.response.RefreshResponse;
import com.lkbird.entity.RefreshToken;
import com.lkbird.entity.User;
import com.lkbird.security.CustomUserDetails;
import com.lkbird.security.JwtService;
import com.lkbird.service.RefreshTokenService;

import org.springframework.web.bind.annotation.RequestBody;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

        private final AuthenticationManager authenticationManager;
        private final JwtService jwtService;
        private final RefreshTokenService refreshTokenService;

        public AuthController(
                        AuthenticationManager authenticationManager,
                        JwtService jwtService,
                        RefreshTokenService refreshTokenService) {

                this.authenticationManager = authenticationManager;
                this.jwtService = jwtService;
                this.refreshTokenService = refreshTokenService;
        }

        @PostMapping("/login")
        public ResponseEntity<LoginResponse> login(
                        @Valid @RequestBody LoginRequest loginRequest) {

                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                loginRequest.getUsername(),
                                                loginRequest.getPassword()));

                CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

                User user = userDetails.getUser();

                String accessToken = jwtService.generateToken(authentication.getName());
                String role = user.getRole() != null ? user.getRole().getName() : null;

                String refreshToken = refreshTokenService
                                .createRefreshToken(user)
                                .getToken();

                LoginResponse response = new LoginResponse(
                                "Đăng nhập thành công",
                                authentication.getName(),
                                role,
                                accessToken,
                                refreshToken);

                return ResponseEntity.ok(response);
        }

        @PostMapping("/refresh")
        public ResponseEntity<RefreshResponse> refresh(
                        @Valid @RequestBody RefreshRequest request) {

                RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(
                                request.getRefreshToken());

                String accessToken = jwtService.generateToken(
                                refreshToken.getUser().getUsername());

                RefreshResponse response = new RefreshResponse(accessToken);

                return ResponseEntity.ok(response);
        }

        @PostMapping("/logout")
        public ResponseEntity<Void> logout(
                        @Valid @RequestBody LogoutRequest request) {

                refreshTokenService.revokeRefreshToken(
                                request.getRefreshToken());

                return ResponseEntity.noContent().build();
        }
}