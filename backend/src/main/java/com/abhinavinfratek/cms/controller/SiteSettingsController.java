package com.abhinavinfratek.cms.controller;

import com.abhinavinfratek.cms.dto.SiteSettingsRequest;
import com.abhinavinfratek.cms.dto.SiteSettingsResponse;
import com.abhinavinfratek.cms.service.SiteSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class SiteSettingsController {

    private final SiteSettingsService siteSettingsService;

    @GetMapping("/api/site-settings")
    public ResponseEntity<SiteSettingsResponse> getPublicSettings() {
        return ResponseEntity.ok(siteSettingsService.getSettings());
    }

    @GetMapping("/api/admin/site-settings")
    public ResponseEntity<SiteSettingsResponse> getAdminSettings() {
        return ResponseEntity.ok(siteSettingsService.getSettings());
    }

    @PutMapping(value = "/api/admin/site-settings", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SiteSettingsResponse> updateSettings(@Valid @ModelAttribute SiteSettingsRequest request) {
        return ResponseEntity.ok(siteSettingsService.updateSettings(request));
    }
}
