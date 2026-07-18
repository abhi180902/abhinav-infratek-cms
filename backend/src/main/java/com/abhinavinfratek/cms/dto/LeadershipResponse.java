package com.abhinavinfratek.cms.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LeadershipResponse {

    private final Long id;
    private final String name;
    private final String designation;
    private final String bio;
    private final String imageUrl;
    private final String imagePublicId;
    private final Integer displayOrder;
    private final Boolean active;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
}
