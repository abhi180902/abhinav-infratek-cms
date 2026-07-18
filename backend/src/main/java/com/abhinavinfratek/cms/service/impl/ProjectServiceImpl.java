package com.abhinavinfratek.cms.service.impl;

import com.abhinavinfratek.cms.dto.ImageUploadResponse;
import com.abhinavinfratek.cms.dto.ProjectRequest;
import com.abhinavinfratek.cms.dto.ProjectResponse;
import com.abhinavinfratek.cms.entity.Project;
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
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private static final String PROJECT_IMAGE_FOLDER = "abhinav-infratek/projects";

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final ImageStorageService imageStorageService;

    @Override
    public List<ProjectResponse> getActiveProjects() {
        return projectRepository.findByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(projectMapper::toResponse)
                .toList();
    }

    @Override
    public ProjectResponse getActiveProjectBySlug(String slug) {
        return projectMapper.toResponse(projectRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with slug: " + slug)));
    }

    @Override
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(projectMapper::toResponse)
                .toList();
    }

    @Override
    public ProjectResponse getProjectById(Long id) {
        return projectMapper.toResponse(findProjectById(id));
    }

    @Override
    public ProjectResponse createProject(ProjectRequest request) {
        validateSlugForCreate(request.getSlug());

        MultipartFile image = request.getImage();
        if (image == null || image.isEmpty()) {
            throw new ImageUploadException("Project image is required");
        }

        ImageUploadResponse imageResponse = imageStorageService.uploadImage(image, PROJECT_IMAGE_FOLDER);
        Project project = projectMapper.toEntity(request, imageResponse);
        return projectMapper.toResponse(projectRepository.save(project));
    }

    @Override
    public ProjectResponse updateProject(Long id, ProjectRequest request) {
        Project project = findProjectById(id);
        validateSlugForUpdate(request.getSlug(), id);
        projectMapper.updateEntity(project, request);

        MultipartFile image = request.getImage();
        if (image != null && !image.isEmpty()) {
            ImageUploadResponse imageResponse = imageStorageService.replaceImage(
                    project.getImagePublicId(),
                    image,
                    PROJECT_IMAGE_FOLDER
            );
            projectMapper.updateImage(project, imageResponse);
        }

        return projectMapper.toResponse(projectRepository.save(project));
    }

    @Override
    public void deleteProject(Long id) {
        Project project = findProjectById(id);
        imageStorageService.deleteImage(project.getImagePublicId());
        projectRepository.delete(project);
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
