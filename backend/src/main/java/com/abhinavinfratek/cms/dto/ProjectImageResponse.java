package com.abhinavinfratek.cms.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProjectImageResponse {

    private final Long id;
    private final String imageUrl;
    private final String imagePublicId;
    private final Integer displayOrder;
    private final LocalDateTime createdAt;
}
