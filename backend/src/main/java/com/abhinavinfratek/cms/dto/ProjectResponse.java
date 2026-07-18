package com.abhinavinfratek.cms.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProjectResponse {

    private final Long id;
    private final String title;
    private final String slug;
    private final String description;
    private final String category;
    private final String location;
    private final LocalDate completionDate;
    private final String imageUrl;
    private final String imagePublicId;
    private final Integer displayOrder;
    private final Boolean featured;
    private final Boolean active;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
}
