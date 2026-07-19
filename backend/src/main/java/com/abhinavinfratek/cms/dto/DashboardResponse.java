package com.abhinavinfratek.cms.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardResponse {

    private final Long services;
    private final Long projects;
    private final Long leadershipMembers;
    private final Long clientReviews;
    private final Long totalEnquiries;
    private final Long newEnquiries;
    private final Long contactedEnquiries;
    private final Long closedEnquiries;
}
