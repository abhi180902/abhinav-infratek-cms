package com.abhinavinfratek.cms.repository;

import com.abhinavinfratek.cms.entity.ProjectImage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectImageRepository extends JpaRepository<ProjectImage, Long> {

    List<ProjectImage> findByProjectIdOrderByDisplayOrderAsc(Long projectId);
}
