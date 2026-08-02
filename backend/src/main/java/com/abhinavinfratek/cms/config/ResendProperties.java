package com.abhinavinfratek.cms.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "resend")
public record ResendProperties(
        @NotBlank
        String apiKey,
        @NotBlank
        String fromEmail,
        @NotBlank
        String companyEmail
) {
}
