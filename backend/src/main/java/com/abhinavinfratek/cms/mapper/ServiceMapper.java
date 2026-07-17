package com.abhinavinfratek.cms.mapper;

import com.abhinavinfratek.cms.dto.ServiceRequest;
import com.abhinavinfratek.cms.dto.ServiceResponse;
import com.abhinavinfratek.cms.entity.ServiceEntity;
import org.springframework.stereotype.Component;

@Component
public class ServiceMapper {

    public ServiceEntity toEntity(ServiceRequest request) {
        return ServiceEntity.builder()
                .slug(normalize(request.getSlug()))
                .iconKey(normalize(request.getIconKey()))
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .displayOrder(request.getDisplayOrder())
                .active(request.getActive())
                .build();
    }

    public void updateEntity(ServiceEntity service, ServiceRequest request) {
        service.setSlug(normalize(request.getSlug()));
        service.setIconKey(normalize(request.getIconKey()));
        service.setTitle(request.getTitle().trim());
        service.setDescription(request.getDescription().trim());
        service.setDisplayOrder(request.getDisplayOrder());
        service.setActive(request.getActive());
    }

    public ServiceResponse toResponse(ServiceEntity service) {
        return ServiceResponse.builder()
                .id(service.getId())
                .slug(service.getSlug())
                .iconKey(service.getIconKey())
                .title(service.getTitle())
                .description(service.getDescription())
                .displayOrder(service.getDisplayOrder())
                .active(service.getActive())
                .createdAt(service.getCreatedAt())
                .updatedAt(service.getUpdatedAt())
                .build();
    }

    private String normalize(String value) {
        return value.trim();
    }
}
