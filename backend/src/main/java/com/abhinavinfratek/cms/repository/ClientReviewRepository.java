package com.abhinavinfratek.cms.repository;

import com.abhinavinfratek.cms.entity.ClientReview;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientReviewRepository extends JpaRepository<ClientReview, Long> {

    List<ClientReview> findAllByOrderByDisplayOrderAsc();

    List<ClientReview> findByActiveTrueOrderByDisplayOrderAsc();
}
