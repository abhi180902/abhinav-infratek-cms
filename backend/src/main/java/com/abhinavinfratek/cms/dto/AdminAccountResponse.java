package com.abhinavinfratek.cms.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdminAccountResponse {

    private final Long id;
    private final String fullName;
    private final String email;
    private final String token;
    private final String type;
    private final Long expiresIn;
}
