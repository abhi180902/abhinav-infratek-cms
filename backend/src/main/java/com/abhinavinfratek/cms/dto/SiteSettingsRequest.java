package com.abhinavinfratek.cms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class SiteSettingsRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 150, message = "Company name must not exceed 150 characters")
    private String companyName;

    @Size(max = 200, message = "Tagline must not exceed 200 characters")
    private String tagline;

    @Size(max = 40, message = "Phone must not exceed 40 characters")
    private String phone;

    @Size(max = 40, message = "Alternate phone must not exceed 40 characters")
    private String alternatePhone;

    @Pattern(
            regexp = "^\\s*$|^\\+?[0-9][0-9\\s-]{7,24}[0-9]$",
            message = "WhatsApp number must include a valid country code and phone number"
    )
    @Size(max = 40, message = "WhatsApp number must not exceed 40 characters")
    private String whatsappNumber;

    @Email(message = "Email must be valid")
    @Size(max = 160, message = "Email must not exceed 160 characters")
    private String email;

    private String address;

    @Size(max = 200, message = "Hero title must not exceed 200 characters")
    private String heroTitle;

    private String heroSubtitle;

    private String aboutCompany;

    @URL(message = "Facebook URL must be valid")
    @Size(max = 500, message = "Facebook URL must not exceed 500 characters")
    private String facebookUrl;

    @URL(message = "Instagram URL must be valid")
    @Size(max = 500, message = "Instagram URL must not exceed 500 characters")
    private String instagramUrl;

    @URL(message = "LinkedIn URL must be valid")
    @Size(max = 500, message = "LinkedIn URL must not exceed 500 characters")
    private String linkedinUrl;

    @URL(message = "YouTube URL must be valid")
    @Size(max = 500, message = "YouTube URL must not exceed 500 characters")
    private String youtubeUrl;

    @URL(message = "Google Maps embed URL must be valid")
    private String googleMapsEmbedUrl;

    private MultipartFile logo;
}
