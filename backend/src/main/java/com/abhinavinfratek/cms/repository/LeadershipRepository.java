package com.abhinavinfratek.cms.repository;

import com.abhinavinfratek.cms.entity.Leadership;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeadershipRepository extends JpaRepository<Leadership, Long> {

    List<Leadership> findAllByOrderByDisplayOrderAsc();

    List<Leadership> findByActiveTrueOrderByDisplayOrderAsc();
}
