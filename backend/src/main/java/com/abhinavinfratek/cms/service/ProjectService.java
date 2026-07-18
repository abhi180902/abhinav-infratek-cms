package com.abhinavinfratek.cms.service;

import com.abhinavinfratek.cms.dto.ProjectRequest;
import com.abhinavinfratek.cms.dto.ProjectResponse;
import java.util.List;

public interface ProjectService {

    List<ProjectResponse> getActiveProjects();

    ProjectResponse getActiveProjectBySlug(String slug);

    List<ProjectResponse> getAllProjects();

    ProjectResponse getProjectById(Long id);

    ProjectResponse createProject(ProjectRequest request);

    ProjectResponse updateProject(Long id, ProjectRequest request);

    void deleteProject(Long id);
}
