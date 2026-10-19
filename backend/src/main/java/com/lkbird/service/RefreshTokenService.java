package com.lkbird.service;

import com.lkbird.entity.RefreshToken;
import com.lkbird.entity.User;

public interface RefreshTokenService {

    RefreshToken createRefreshToken(User user);

    RefreshToken verifyRefreshToken(String token);

    void revokeRefreshToken(String token);
}