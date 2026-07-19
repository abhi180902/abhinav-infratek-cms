package com.abhinavinfratek.cms.config;

import com.abhinavinfratek.cms.constants.AppConstants;
import com.abhinavinfratek.cms.entity.AdminUser;
import com.abhinavinfratek.cms.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminUserSeeder {

    private static final Logger LOGGER = LoggerFactory.getLogger(AdminUserSeeder.class);

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${cms.admin.email:}")
    private String defaultAdminEmail;

    @Value("${cms.admin.password:}")
    private String defaultAdminPassword;

    @Bean
    public CommandLineRunner seedAdminUser() {
        return args -> {
            if (adminUserRepository.existsByRole(AppConstants.ROLE_ADMIN)) {
                return;
            }

            if (isBlank(defaultAdminEmail) || isBlank(defaultAdminPassword)) {
                LOGGER.info("No admin credentials configured. Skipping admin creation.");
                return;
            }

            AdminUser adminUser = AdminUser.builder()
                    .fullName("Abhinav Infratek Admin")
                    .email(defaultAdminEmail.trim().toLowerCase())
                    .password(passwordEncoder.encode(defaultAdminPassword))
                    .role(AppConstants.ROLE_ADMIN)
                    .active(true)
                    .build();

            adminUserRepository.save(adminUser);
        };
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
