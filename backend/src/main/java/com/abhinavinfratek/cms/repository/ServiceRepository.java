package com.abhinavinfratek.cms.repository;

import com.abhinavinfratek.cms.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
}
