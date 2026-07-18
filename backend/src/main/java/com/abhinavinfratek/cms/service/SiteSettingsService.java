package com.abhinavinfratek.cms.service;

import com.abhinavinfratek.cms.dto.SiteSettingsRequest;
import com.abhinavinfratek.cms.dto.SiteSettingsResponse;

public interface SiteSettingsService {

    SiteSettingsResponse getSettings();

    SiteSettingsResponse updateSettings(SiteSettingsRequest request);
}
