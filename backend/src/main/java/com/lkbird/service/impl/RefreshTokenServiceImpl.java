package com.lkbird.service.impl;

import java.time.Instant;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.lkbird.entity.RefreshToken;
import com.lkbird.entity.User;
import com.lkbird.exception.ResourceNotFoundException;
import com.lkbird.repository.RefreshTokenRepository;
import com.lkbird.service.RefreshTokenService;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenServiceImpl(
            RefreshTokenRepository refreshTokenRepository) {

        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Override
    public RefreshToken createRefreshToken(User user) {

        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setToken(UUID.randomUUID().toString());

        refreshToken.setExpiryDate(
                Instant.now().plusSeconds(60L * 60 * 24 * 7));

        refreshToken.setRevoked(false);

        refreshToken.setUser(user);

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public RefreshToken verifyRefreshToken(String token) {

        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Refresh Token không tồn tại"));

        if (refreshToken.isRevoked()) {
            throw new ResourceNotFoundException(
                    "Refresh Token đã bị thu hồi");
        }

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            throw new ResourceNotFoundException(
                    "Refresh Token đã hết hạn");
        }

        return refreshToken;
    }

    @Override
    public void revokeRefreshToken(String token) {

        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Refresh Token không tồn tại"));

        refreshToken.setRevoked(true);

        refreshTokenRepository.save(refreshToken);
    }
}