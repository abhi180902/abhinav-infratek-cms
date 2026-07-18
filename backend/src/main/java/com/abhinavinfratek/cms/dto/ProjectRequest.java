package com.abhinavinfratek.cms.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ProjectRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    @NotBlank(message = "Slug is required")
    @Size(max = 170, message = "Slug must not exceed 170 characters")
    private String slug;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category;

    @Size(max = 150, message = "Location must not exceed 150 characters")
    private String location;

    private LocalDate completionDate;

    @NotNull(message = "Display order is required")
    @Min(value = 0, message = "Display order must be greater than or equal to 0")
    private Integer displayOrder;

    @NotNull(message = "Featured status is required")
    private Boolean featured;

    @NotNull(message = "Active status is required")
    private Boolean active;

    private MultipartFile image;
}
