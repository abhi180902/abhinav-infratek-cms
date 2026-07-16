package com.abhinavinfratek.cms.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {

    private final String token;
    private final String type;
    private final long expiresIn;
    private final String name;
    private final String email;
    private final String role;
}
