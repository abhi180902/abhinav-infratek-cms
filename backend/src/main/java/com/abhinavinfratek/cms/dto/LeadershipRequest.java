package com.abhinavinfratek.cms.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class LeadershipRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 120, message = "Name must not exceed 120 characters")
    private String name;

    @NotBlank(message = "Designation is required")
    @Size(max = 120, message = "Designation must not exceed 120 characters")
    private String designation;

    @Size(max = 3000, message = "Bio must not exceed 3000 characters")
    private String bio;

    @NotNull(message = "Display order is required")
    @Min(value = 0, message = "Display order must be greater than or equal to 0")
    private Integer displayOrder;

    @NotNull(message = "Active status is required")
    private Boolean active;

    private MultipartFile image;
}
