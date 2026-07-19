package com.abhinavinfratek.cms.service.impl;

import com.abhinavinfratek.cms.constants.AppConstants;
import com.abhinavinfratek.cms.dto.AdminAccountResponse;
import com.abhinavinfratek.cms.dto.ChangePasswordRequest;
import com.abhinavinfratek.cms.dto.SuccessResponse;
import com.abhinavinfratek.cms.dto.UpdateAdminAccountRequest;
import com.abhinavinfratek.cms.entity.AdminUser;
import com.abhinavinfratek.cms.exception.AdminAccountException;
import com.abhinavinfratek.cms.exception.ResourceNotFoundException;
import com.abhinavinfratek.cms.repository.AdminUserRepository;
import com.abhinavinfratek.cms.security.JwtService;
import com.abhinavinfratek.cms.service.AdminAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminAccountServiceImpl implements AdminAccountService {

    private final AdminUserRepository adminUserRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.jwt.expiration-seconds}")
    private long expiresIn;

    @Override
    @Transactional(readOnly = true)
    public AdminAccountResponse getAccount(String email) {
        return toResponse(getCurrentAdmin(email), null);
    }

    @Override
    @Transactional
    public AdminAccountResponse updateAccount(String email, UpdateAdminAccountRequest request) {
        AdminUser adminUser = getCurrentAdmin(email);
        String nextEmail = request.getEmail().trim().toLowerCase();

        if (adminUserRepository.existsByEmailAndIdNot(nextEmail, adminUser.getId())) {
            throw new AdminAccountException("Email is already in use.");
        }

        adminUser.setFullName(request.getFullName().trim());
        adminUser.setEmail(nextEmail);

        AdminUser savedUser = adminUserRepository.save(adminUser);
        return toResponse(savedUser, jwtService.generateToken(savedUser));
    }

    @Override
    @Transactional
    public SuccessResponse changePassword(String email, ChangePasswordRequest request) {
        AdminUser adminUser = getCurrentAdmin(email);

        if (!passwordEncoder.matches(request.getCurrentPassword(), adminUser.getPassword())) {
            throw new AdminAccountException("Current password is incorrect.");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AdminAccountException("New password and confirm password must match.");
        }

        adminUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        adminUserRepository.save(adminUser);

        return SuccessResponse.builder()
                .message("Password changed successfully.")
                .build();
    }

    private AdminUser getCurrentAdmin(String email) {
        return adminUserRepository.findByEmail(email)
                .filter(adminUser -> Boolean.TRUE.equals(adminUser.getActive()))
                .orElseThrow(() -> new ResourceNotFoundException("Admin account not found"));
    }

    private AdminAccountResponse toResponse(AdminUser adminUser, String token) {
        return AdminAccountResponse.builder()
                .id(adminUser.getId())
                .fullName(adminUser.getFullName())
                .email(adminUser.getEmail())
                .token(token)
                .type(token == null ? null : AppConstants.TOKEN_TYPE_BEARER)
                .expiresIn(token == null ? null : expiresIn)
                .build();
    }
}
