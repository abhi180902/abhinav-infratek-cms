package com.abhinavinfratek.cms.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ImageUploadResponse {

    private final String secureUrl;
    private final String publicId;
    private final String originalFilename;
    private final Integer width;
    private final Integer height;
    private final String format;
    private final Long bytes;
}
