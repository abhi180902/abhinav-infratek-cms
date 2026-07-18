package com.abhinavinfratek.cms.repository;

import com.abhinavinfratek.cms.entity.SiteSettings;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteSettingsRepository extends JpaRepository<SiteSettings, Long> {

    Optional<SiteSettings> findFirstByOrderByIdAsc();
}
