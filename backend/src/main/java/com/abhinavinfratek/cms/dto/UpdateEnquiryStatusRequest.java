package com.abhinavinfratek.cms.dto;

import com.abhinavinfratek.cms.entity.Enquiry;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateEnquiryStatusRequest {

    @NotNull(message = "Status is required")
    private Enquiry.Status status;
}
