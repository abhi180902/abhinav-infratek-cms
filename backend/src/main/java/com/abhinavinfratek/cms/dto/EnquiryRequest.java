package com.abhinavinfratek.cms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnquiryRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 120, message = "Name must not exceed 120 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    private String email;

    @NotBlank(message = "Phone is required")
    @Size(max = 20, message = "Phone must not exceed 20 characters")
    private String phone;

    @NotBlank(message = "Project type is required")
    @Size(max = 120, message = "Project type must not exceed 120 characters")
    private String projectType;

    @NotBlank(message = "Message is required")
    @Size(max = 2000, message = "Message must not exceed 2000 characters")
    private String message;
}
