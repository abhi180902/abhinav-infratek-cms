package com.abhinavinfratek.cms.service.impl;

import com.abhinavinfratek.cms.constants.AppConstants;
import com.abhinavinfratek.cms.dto.LoginRequest;
import com.abhinavinfratek.cms.dto.LoginResponse;
import com.abhinavinfratek.cms.entity.AdminUser;
import com.abhinavinfratek.cms.exception.AuthenticationException;
import com.abhinavinfratek.cms.repository.AdminUserRepository;
import com.abhinavinfratek.cms.security.JwtService;
import com.abhinavinfratek.cms.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AdminUserRepository adminUserRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.jwt.expiration-seconds}")
    private long expiresIn;

    @Override
    public LoginResponse login(LoginRequest request) {
        AdminUser adminUser = adminUserRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new AuthenticationException("Invalid email or password"));

        if (!Boolean.TRUE.equals(adminUser.getActive())) {
            throw new AuthenticationException("Admin account is inactive");
        }

        if (!passwordEncoder.matches(request.getPassword(), adminUser.getPassword())) {
            throw new AuthenticationException("Invalid email or password");
        }

        String token = jwtService.generateToken(adminUser);

        return LoginResponse.builder()
                .token(token)
                .type(AppConstants.TOKEN_TYPE_BEARER)
                .expiresIn(expiresIn)
                .name(adminUser.getFullName())
                .email(adminUser.getEmail())
                .role(adminUser.getRole())
                .build();
    }
}
