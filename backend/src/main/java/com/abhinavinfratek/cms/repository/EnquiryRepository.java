package com.abhinavinfratek.cms.repository;

import com.abhinavinfratek.cms.entity.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {

    long countByStatus(Enquiry.Status status);
}
