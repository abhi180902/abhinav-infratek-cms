package com.abhinavinfratek.cms.service;

import com.abhinavinfratek.cms.dto.LeadershipRequest;
import com.abhinavinfratek.cms.dto.LeadershipResponse;
import java.util.List;

public interface LeadershipService {

    List<LeadershipResponse> getActiveLeadershipMembers();

    List<LeadershipResponse> getAllLeadershipMembers();

    LeadershipResponse getLeadershipMemberById(Long id);

    LeadershipResponse createLeadershipMember(LeadershipRequest request);

    LeadershipResponse updateLeadershipMember(Long id, LeadershipRequest request);

    void deleteLeadershipMember(Long id);
}
