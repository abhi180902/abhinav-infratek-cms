package com.abhinavinfratek.cms.mapper;

import com.abhinavinfratek.cms.dto.ImageUploadResponse;
import com.abhinavinfratek.cms.dto.LeadershipRequest;
import com.abhinavinfratek.cms.dto.LeadershipResponse;
import com.abhinavinfratek.cms.entity.Leadership;
import org.springframework.stereotype.Component;

@Component
public class LeadershipMapper {

    public Leadership toEntity(LeadershipRequest request, ImageUploadResponse image) {
        return Leadership.builder()
                .name(request.getName().trim())
                .designation(request.getDesignation().trim())
                .bio(normalizeOptional(request.getBio()))
                .imageUrl(image.getSecureUrl())
                .imagePublicId(image.getPublicId())
                .displayOrder(request.getDisplayOrder())
                .active(request.getActive())
                .build();
    }

    public void updateEntity(Leadership leadership, LeadershipRequest request) {
        leadership.setName(request.getName().trim());
        leadership.setDesignation(request.getDesignation().trim());
        leadership.setBio(normalizeOptional(request.getBio()));
        leadership.setDisplayOrder(request.getDisplayOrder());
        leadership.setActive(request.getActive());
    }

    public void updateImage(Leadership leadership, ImageUploadResponse image) {
        leadership.setImageUrl(image.getSecureUrl());
        leadership.setImagePublicId(image.getPublicId());
    }

    public LeadershipResponse toResponse(Leadership leadership) {
        return LeadershipResponse.builder()
                .id(leadership.getId())
                .name(leadership.getName())
                .designation(leadership.getDesignation())
                .bio(leadership.getBio())
                .imageUrl(leadership.getImageUrl())
                .imagePublicId(leadership.getImagePublicId())
                .displayOrder(leadership.getDisplayOrder())
                .active(leadership.getActive())
                .createdAt(leadership.getCreatedAt())
                .updatedAt(leadership.getUpdatedAt())
                .build();
    }

    private String normalizeOptional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
