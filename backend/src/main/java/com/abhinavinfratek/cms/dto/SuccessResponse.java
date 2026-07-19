package com.abhinavinfratek.cms.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SuccessResponse {

    private final String message;
}
