package com.abhinavinfratek.cms.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServiceRequest {

    @NotBlank(message = "Slug is required")
    @Size(max = 120, message = "Slug must not exceed 120 characters")
    private String slug;

    @NotBlank(message = "Icon key is required")
    @Size(max = 80, message = "Icon key must not exceed 80 characters")
    private String iconKey;

    @NotBlank(message = "Title is required")
    @Size(max = 160, message = "Title must not exceed 160 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Display order is required")
    @Min(value = 0, message = "Display order must be greater than or equal to 0")
    private Integer displayOrder;

    @NotNull(message = "Active status is required")
    private Boolean active;
}
