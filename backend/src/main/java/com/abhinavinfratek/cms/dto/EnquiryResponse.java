package com.abhinavinfratek.cms.dto;

import com.abhinavinfratek.cms.entity.Enquiry;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EnquiryResponse {

    private final Long id;
    private final String name;
    private final String email;
    private final String phone;
    private final String projectType;
    private final String message;
    private final Enquiry.Status status;
    private final LocalDateTime createdAt;
}
