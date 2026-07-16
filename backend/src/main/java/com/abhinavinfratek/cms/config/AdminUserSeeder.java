package com.abhinavinfratek.cms.config;

import com.abhinavinfratek.cms.constants.AppConstants;
import com.abhinavinfratek.cms.entity.AdminUser;
import com.abhinavinfratek.cms.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminUserSeeder {

    private static final String DEFAULT_ADMIN_EMAIL = "admin@abhinavinfratek.com";
    private static final String DEFAULT_ADMIN_PASSWORD = "Admin@123";

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedAdminUser() {
        return args -> {
            if (adminUserRepository.existsByEmail(DEFAULT_ADMIN_EMAIL)) {
                return;
            }

            AdminUser adminUser = AdminUser.builder()
                    .fullName("Abhinav Infratek Admin")
                    .email(DEFAULT_ADMIN_EMAIL)
                    .password(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD))
                    .role(AppConstants.ROLE_ADMIN)
                    .active(true)
                    .build();

            adminUserRepository.save(adminUser);
        };
    }
}
