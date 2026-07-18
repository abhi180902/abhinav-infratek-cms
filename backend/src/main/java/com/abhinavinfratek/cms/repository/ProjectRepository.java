package com.abhinavinfratek.cms.repository;

import com.abhinavinfratek.cms.entity.Project;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findAllByOrderByDisplayOrderAsc();

    List<Project> findByActiveTrueOrderByDisplayOrderAsc();

    Optional<Project> findBySlugAndActiveTrue(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);
}
