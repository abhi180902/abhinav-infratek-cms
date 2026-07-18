package com.abhinavinfratek.cms.service.impl;

import com.abhinavinfratek.cms.dto.ImageUploadResponse;
import com.abhinavinfratek.cms.dto.SiteSettingsRequest;
import com.abhinavinfratek.cms.dto.SiteSettingsResponse;
import com.abhinavinfratek.cms.entity.SiteSettings;
import com.abhinavinfratek.cms.mapper.SiteSettingsMapper;
import com.abhinavinfratek.cms.repository.SiteSettingsRepository;
import com.abhinavinfratek.cms.service.ImageStorageService;
import com.abhinavinfratek.cms.service.SiteSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class SiteSettingsServiceImpl implements SiteSettingsService {

    private static final String SITE_SETTINGS_LOGO_FOLDER = "abhinav-infratek/site-settings";

    private final SiteSettingsRepository siteSettingsRepository;
    private final SiteSettingsMapper siteSettingsMapper;
    private final ImageStorageService imageStorageService;

    @Override
    public SiteSettingsResponse getSettings() {
        return siteSettingsMapper.toResponse(getOrCreateSettings());
    }

    @Override
    public SiteSettingsResponse updateSettings(SiteSettingsRequest request) {
        SiteSettings siteSettings = getOrCreateSettings();
        siteSettingsMapper.updateEntity(siteSettings, request);

        MultipartFile logo = request.getLogo();
        if (logo != null && !logo.isEmpty()) {
            ImageUploadResponse logoResponse = replaceLogo(siteSettings, logo);
            siteSettingsMapper.updateLogo(siteSettings, logoResponse);
        }

        return siteSettingsMapper.toResponse(siteSettingsRepository.save(siteSettings));
    }

    private SiteSettings getOrCreateSettings() {
        return siteSettingsRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> siteSettingsRepository.save(SiteSettings.builder()
                        .companyName("")
                        .build()));
    }

    private ImageUploadResponse replaceLogo(SiteSettings siteSettings, MultipartFile logo) {
        if (siteSettings.getLogoPublicId() == null || siteSettings.getLogoPublicId().isBlank()) {
            return imageStorageService.uploadImage(logo, SITE_SETTINGS_LOGO_FOLDER);
        }

        return imageStorageService.replaceImage(
                siteSettings.getLogoPublicId(),
                logo,
                SITE_SETTINGS_LOGO_FOLDER
        );
    }
}
