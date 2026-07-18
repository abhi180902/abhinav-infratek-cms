package com.abhinavinfratek.cms.mapper;

import com.abhinavinfratek.cms.dto.ImageUploadResponse;
import com.abhinavinfratek.cms.dto.SiteSettingsRequest;
import com.abhinavinfratek.cms.dto.SiteSettingsResponse;
import com.abhinavinfratek.cms.entity.SiteSettings;
import org.springframework.stereotype.Component;

@Component
public class SiteSettingsMapper {

    public void updateEntity(SiteSettings siteSettings, SiteSettingsRequest request) {
        siteSettings.setCompanyName(request.getCompanyName().trim());
        siteSettings.setTagline(normalizeOptional(request.getTagline()));
        siteSettings.setPhone(normalizeOptional(request.getPhone()));
        siteSettings.setAlternatePhone(normalizeOptional(request.getAlternatePhone()));
        siteSettings.setEmail(normalizeOptional(request.getEmail()));
        siteSettings.setAddress(normalizeOptional(request.getAddress()));
        siteSettings.setHeroTitle(normalizeOptional(request.getHeroTitle()));
        siteSettings.setHeroSubtitle(normalizeOptional(request.getHeroSubtitle()));
        siteSettings.setAboutCompany(normalizeOptional(request.getAboutCompany()));
        siteSettings.setFacebookUrl(normalizeOptional(request.getFacebookUrl()));
        siteSettings.setInstagramUrl(normalizeOptional(request.getInstagramUrl()));
        siteSettings.setLinkedinUrl(normalizeOptional(request.getLinkedinUrl()));
        siteSettings.setYoutubeUrl(normalizeOptional(request.getYoutubeUrl()));
        siteSettings.setGoogleMapsEmbedUrl(normalizeOptional(request.getGoogleMapsEmbedUrl()));
    }

    public void updateLogo(SiteSettings siteSettings, ImageUploadResponse logo) {
        siteSettings.setLogoUrl(logo.getSecureUrl());
        siteSettings.setLogoPublicId(logo.getPublicId());
    }

    public SiteSettingsResponse toResponse(SiteSettings siteSettings) {
        return SiteSettingsResponse.builder()
                .id(siteSettings.getId())
                .companyName(siteSettings.getCompanyName())
                .tagline(siteSettings.getTagline())
                .phone(siteSettings.getPhone())
                .alternatePhone(siteSettings.getAlternatePhone())
                .email(siteSettings.getEmail())
                .address(siteSettings.getAddress())
                .heroTitle(siteSettings.getHeroTitle())
                .heroSubtitle(siteSettings.getHeroSubtitle())
                .aboutCompany(siteSettings.getAboutCompany())
                .logoUrl(siteSettings.getLogoUrl())
                .logoPublicId(siteSettings.getLogoPublicId())
                .facebookUrl(siteSettings.getFacebookUrl())
                .instagramUrl(siteSettings.getInstagramUrl())
                .linkedinUrl(siteSettings.getLinkedinUrl())
                .youtubeUrl(siteSettings.getYoutubeUrl())
                .googleMapsEmbedUrl(siteSettings.getGoogleMapsEmbedUrl())
                .createdAt(siteSettings.getCreatedAt())
                .updatedAt(siteSettings.getUpdatedAt())
                .build();
    }

    private String normalizeOptional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
