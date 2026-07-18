package com.abhinavinfratek.cms.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ClientReviewRequest {

    @NotBlank(message = "Client name is required")
    @Size(max = 120, message = "Client name must not exceed 120 characters")
    private String clientName;

    @Size(max = 150, message = "Company name must not exceed 150 characters")
    private String companyName;

    @Size(max = 120, message = "Designation must not exceed 120 characters")
    private String designation;

    @NotBlank(message = "Review is required")
    private String review;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must not exceed 5")
    private Integer rating;

    @NotNull(message = "Display order is required")
    @Min(value = 0, message = "Display order must be greater than or equal to 0")
    private Integer displayOrder;

    @NotNull(message = "Active status is required")
    private Boolean active;

    private MultipartFile image;
}
