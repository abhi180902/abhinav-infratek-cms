package com.abhinavinfratek.cms.mapper;

import com.abhinavinfratek.cms.dto.ClientReviewRequest;
import com.abhinavinfratek.cms.dto.ClientReviewResponse;
import com.abhinavinfratek.cms.dto.ImageUploadResponse;
import com.abhinavinfratek.cms.entity.ClientReview;
import org.springframework.stereotype.Component;

@Component
public class ClientReviewMapper {

    public ClientReview toEntity(ClientReviewRequest request, ImageUploadResponse image) {
        return ClientReview.builder()
                .clientName(request.getClientName().trim())
                .companyName(normalizeOptional(request.getCompanyName()))
                .designation(normalizeOptional(request.getDesignation()))
                .review(request.getReview().trim())
                .rating(request.getRating())
                .imageUrl(image == null ? null : image.getSecureUrl())
                .imagePublicId(image == null ? null : image.getPublicId())
                .displayOrder(request.getDisplayOrder())
                .active(request.getActive())
                .build();
    }

    public void updateEntity(ClientReview clientReview, ClientReviewRequest request) {
        clientReview.setClientName(request.getClientName().trim());
        clientReview.setCompanyName(normalizeOptional(request.getCompanyName()));
        clientReview.setDesignation(normalizeOptional(request.getDesignation()));
        clientReview.setReview(request.getReview().trim());
        clientReview.setRating(request.getRating());
        clientReview.setDisplayOrder(request.getDisplayOrder());
        clientReview.setActive(request.getActive());
    }

    public void updateImage(ClientReview clientReview, ImageUploadResponse image) {
        clientReview.setImageUrl(image.getSecureUrl());
        clientReview.setImagePublicId(image.getPublicId());
    }

    public ClientReviewResponse toResponse(ClientReview clientReview) {
        return ClientReviewResponse.builder()
                .id(clientReview.getId())
                .clientName(clientReview.getClientName())
                .companyName(clientReview.getCompanyName())
                .designation(clientReview.getDesignation())
                .review(clientReview.getReview())
                .rating(clientReview.getRating())
                .imageUrl(clientReview.getImageUrl())
                .imagePublicId(clientReview.getImagePublicId())
                .displayOrder(clientReview.getDisplayOrder())
                .active(clientReview.getActive())
                .createdAt(clientReview.getCreatedAt())
                .updatedAt(clientReview.getUpdatedAt())
                .build();
    }

    private String normalizeOptional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
