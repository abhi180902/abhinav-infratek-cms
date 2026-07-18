package com.abhinavinfratek.cms.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ClientReviewResponse {

    private final Long id;
    private final String clientName;
    private final String companyName;
    private final String designation;
    private final String review;
    private final Integer rating;
    private final String imageUrl;
    private final String imagePublicId;
    private final Integer displayOrder;
    private final Boolean active;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
}
