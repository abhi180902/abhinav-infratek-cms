package com.abhinavinfratek.cms.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@EnableConfigurationProperties(ResendProperties.class)
public class WebClientConfig {

    private static final String RESEND_BASE_URL = "https://api.resend.com";

    @Bean
    public WebClient resendWebClient(ResendProperties resendProperties) {
        return WebClient.builder()
                .baseUrl(RESEND_BASE_URL)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + resendProperties.apiKey())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
}
