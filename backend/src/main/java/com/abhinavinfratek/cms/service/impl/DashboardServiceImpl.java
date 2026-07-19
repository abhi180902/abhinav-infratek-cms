package com.abhinavinfratek.cms.service.impl;

import com.abhinavinfratek.cms.dto.DashboardResponse;
import com.abhinavinfratek.cms.entity.Enquiry;
import com.abhinavinfratek.cms.repository.ClientReviewRepository;
import com.abhinavinfratek.cms.repository.EnquiryRepository;
import com.abhinavinfratek.cms.repository.LeadershipRepository;
import com.abhinavinfratek.cms.repository.ProjectRepository;
import com.abhinavinfratek.cms.repository.ServiceRepository;
import com.abhinavinfratek.cms.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ServiceRepository serviceRepository;
    private final ProjectRepository projectRepository;
    private final LeadershipRepository leadershipRepository;
    private final ClientReviewRepository clientReviewRepository;
    private final EnquiryRepository enquiryRepository;

    @Override
    public DashboardResponse getDashboardSummary() {
        return DashboardResponse.builder()
                .services(serviceRepository.count())
                .projects(projectRepository.count())
                .leadershipMembers(leadershipRepository.count())
                .clientReviews(clientReviewRepository.count())
                .totalEnquiries(enquiryRepository.count())
                .newEnquiries(enquiryRepository.countByStatus(Enquiry.Status.NEW))
                .contactedEnquiries(enquiryRepository.countByStatus(Enquiry.Status.CONTACTED))
                .closedEnquiries(enquiryRepository.countByStatus(Enquiry.Status.CLOSED))
                .build();
    }
}
