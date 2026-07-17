package com.abhinavinfratek.cms.mapper;

import com.abhinavinfratek.cms.dto.EnquiryRequest;
import com.abhinavinfratek.cms.dto.EnquiryResponse;
import com.abhinavinfratek.cms.entity.Enquiry;
import org.springframework.stereotype.Component;

@Component
public class EnquiryMapper {

    public Enquiry toEntity(EnquiryRequest request) {
        return Enquiry.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .phone(request.getPhone().trim())
                .projectType(request.getProjectType().trim())
                .message(request.getMessage().trim())
                .status(Enquiry.Status.NEW)
                .build();
    }

    public EnquiryResponse toResponse(Enquiry enquiry) {
        return EnquiryResponse.builder()
                .id(enquiry.getId())
                .name(enquiry.getName())
                .email(enquiry.getEmail())
                .phone(enquiry.getPhone())
                .projectType(enquiry.getProjectType())
                .message(enquiry.getMessage())
                .status(enquiry.getStatus())
                .createdAt(enquiry.getCreatedAt())
                .build();
    }
}
