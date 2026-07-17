package com.abhinavinfratek.cms.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ServiceResponse {

    private final Long id;
    private final String slug;
    private final String iconKey;
    private final String title;
    private final String description;
    private final Integer displayOrder;
    private final Boolean active;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
}
