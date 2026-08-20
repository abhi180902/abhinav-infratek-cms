package com.abhinavinfratek.cms.mapper;

import com.abhinavinfratek.cms.dto.ImageUploadResponse;
import com.abhinavinfratek.cms.dto.ProjectImageResponse;
import com.abhinavinfratek.cms.dto.ProjectRequest;
import com.abhinavinfratek.cms.dto.ProjectResponse;
import com.abhinavinfratek.cms.entity.Project;
import com.abhinavinfratek.cms.entity.ProjectImage;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class ProjectMapper {

    public Project toEntity(ProjectRequest request, ImageUploadResponse image) {
        return Project.builder()
                .title(request.getTitle().trim())
                .slug(request.getSlug().trim())
                .description(request.getDescription().trim())
                .category(request.getCategory().trim())
                .location(normalizeOptional(request.getLocation()))
                .completionDate(request.getCompletionDate())
                .imageUrl(image.getSecureUrl())
                .imagePublicId(image.getPublicId())
                .displayOrder(request.getDisplayOrder())
                .featured(request.getFeatured())
                .active(request.getActive())
                .build();
    }

    public void updateEntity(Project project, ProjectRequest request) {
        project.setTitle(request.getTitle().trim());
        project.setSlug(request.getSlug().trim());
        project.setDescription(request.getDescription().trim());
        project.setCategory(request.getCategory().trim());
        project.setLocation(normalizeOptional(request.getLocation()));
        project.setCompletionDate(request.getCompletionDate());
        project.setDisplayOrder(request.getDisplayOrder());
        project.setFeatured(request.getFeatured());
        project.setActive(request.getActive());
    }

    public void updateImage(Project project, ImageUploadResponse image) {
        project.setImageUrl(image.getSecureUrl());
        project.setImagePublicId(image.getPublicId());
    }

    public ProjectResponse toResponse(Project project) {
        return toResponse(project, true);
    }

    public ProjectResponse toResponse(Project project, boolean includeGalleryImages) {
        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .slug(project.getSlug())
                .description(project.getDescription())
                .category(project.getCategory())
                .location(project.getLocation())
                .completionDate(project.getCompletionDate())
                .imageUrl(project.getImageUrl())
                .imagePublicId(project.getImagePublicId())
                .images(includeGalleryImages ? project.getImages().stream().map(this::toImageResponse).toList() : List.of())
                .displayOrder(project.getDisplayOrder())
                .featured(project.getFeatured())
                .active(project.getActive())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    public ProjectImage toProjectImage(ImageUploadResponse image, int displayOrder) {
        return ProjectImage.builder()
                .imageUrl(image.getSecureUrl())
                .imagePublicId(image.getPublicId())
                .displayOrder(displayOrder)
                .build();
    }

    public ProjectImageResponse toImageResponse(ProjectImage image) {
        return ProjectImageResponse.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .imagePublicId(image.getImagePublicId())
                .displayOrder(image.getDisplayOrder())
                .createdAt(image.getCreatedAt())
                .build();
    }

    private String normalizeOptional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
