package com.abhinavinfratek.cms.service.impl;

import com.abhinavinfratek.cms.dto.ImageUploadResponse;
import com.abhinavinfratek.cms.dto.ProjectRequest;
import com.abhinavinfratek.cms.dto.ProjectResponse;
import com.abhinavinfratek.cms.entity.Project;
import com.abhinavinfratek.cms.entity.ProjectImage;
import com.abhinavinfratek.cms.exception.ImageUploadException;
import com.abhinavinfratek.cms.exception.ResourceNotFoundException;
import com.abhinavinfratek.cms.mapper.ProjectMapper;
import com.abhinavinfratek.cms.repository.ProjectRepository;
import com.abhinavinfratek.cms.service.ImageStorageService;
import com.abhinavinfratek.cms.service.ProjectService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private static final String PROJECT_IMAGE_FOLDER = "abhinav-infratek/projects";
    private static final String PROJECT_GALLERY_FOLDER = "abhinav-infratek/projects/gallery";

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final ImageStorageService imageStorageService;

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getActiveProjects() {
        return projectRepository.findByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(project -> projectMapper.toResponse(project, false))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getActiveProjectBySlug(String slug) {
        return projectMapper.toResponse(projectRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with slug: " + slug)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(projectMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id) {
        return projectMapper.toResponse(findProjectById(id));
    }

    @Override
    @Transactional
    public ProjectResponse createProject(ProjectRequest request) {
        validateSlugForCreate(request.getSlug());

        MultipartFile image = getCoverImage(request);
        if (image == null || image.isEmpty()) {
            throw new ImageUploadException("Cover image is required");
        }

        ImageUploadResponse imageResponse = imageStorageService.uploadImage(image, PROJECT_IMAGE_FOLDER);
        Project project = projectMapper.toEntity(request, imageResponse);
        addGalleryImages(project, request.getGalleryImages());
        return projectMapper.toResponse(projectRepository.save(project));
    }

    @Override
    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request) {
        Project project = findProjectById(id);
        validateSlugForUpdate(request.getSlug(), id);
        projectMapper.updateEntity(project, request);
        removeGalleryImages(project, request.getRemoveImageIds());

        MultipartFile image = getCoverImage(request);
        if (image != null && !image.isEmpty()) {
            ImageUploadResponse imageResponse = imageStorageService.replaceImage(
                    project.getImagePublicId(),
                    image,
                    PROJECT_IMAGE_FOLDER
            );
            projectMapper.updateImage(project, imageResponse);
        }

        addGalleryImages(project, request.getGalleryImages());
        return projectMapper.toResponse(projectRepository.save(project));
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        Project project = findProjectById(id);
        imageStorageService.deleteImage(project.getImagePublicId());
        project.getImages().forEach(image -> imageStorageService.deleteImage(image.getImagePublicId()));
        projectRepository.delete(project);
    }

    private MultipartFile getCoverImage(ProjectRequest request) {
        return request.getCoverImage() != null ? request.getCoverImage() : request.getImage();
    }

    private void addGalleryImages(Project project, List<MultipartFile> images) {
        if (images == null || images.isEmpty()) {
            return;
        }

        int nextOrder = project.getImages().stream()
                .map(ProjectImage::getDisplayOrder)
                .filter(order -> order != null)
                .max(Integer::compareTo)
                .orElse(-1) + 1;

        for (MultipartFile image : images) {
            if (image != null && !image.isEmpty()) {
                ImageUploadResponse uploadResponse = imageStorageService.uploadImage(image, PROJECT_GALLERY_FOLDER);
                project.addImage(projectMapper.toProjectImage(uploadResponse, nextOrder++));
            }
        }
    }

    private void removeGalleryImages(Project project, List<Long> imageIds) {
        if (imageIds == null || imageIds.isEmpty()) {
            return;
        }

        List<ProjectImage> imagesToRemove = project.getImages().stream()
                .filter(image -> imageIds.contains(image.getId()))
                .toList();

        imagesToRemove.forEach(image -> {
            imageStorageService.deleteImage(image.getImagePublicId());
            project.removeImage(image);
        });
    }

    private Project findProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    private void validateSlugForCreate(String slug) {
        if (projectRepository.existsBySlug(slug.trim())) {
            throw new DataIntegrityViolationException("Project slug already exists: " + slug);
        }
    }

    private void validateSlugForUpdate(String slug, Long id) {
        if (projectRepository.existsBySlugAndIdNot(slug.trim(), id)) {
            throw new DataIntegrityViolationException("Project slug already exists: " + slug);
        }
    }
}
