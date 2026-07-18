package com.abhinavinfratek.cms.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SiteSettingsResponse {

    private final Long id;
    private final String companyName;
    private final String tagline;
    private final String phone;
    private final String alternatePhone;
    private final String email;
    private final String address;
    private final String heroTitle;
    private final String heroSubtitle;
    private final String aboutCompany;
    private final String logoUrl;
    private final String logoPublicId;
    private final String facebookUrl;
    private final String instagramUrl;
    private final String linkedinUrl;
    private final String youtubeUrl;
    private final String googleMapsEmbedUrl;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
}
