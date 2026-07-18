package com.abhinavinfratek.cms.service;

import com.abhinavinfratek.cms.dto.ClientReviewRequest;
import com.abhinavinfratek.cms.dto.ClientReviewResponse;
import java.util.List;

public interface ClientReviewService {

    List<ClientReviewResponse> getActiveClientReviews();

    List<ClientReviewResponse> getAllClientReviews();

    ClientReviewResponse getClientReviewById(Long id);

    ClientReviewResponse createClientReview(ClientReviewRequest request);

    ClientReviewResponse updateClientReview(Long id, ClientReviewRequest request);

    void deleteClientReview(Long id);
}
