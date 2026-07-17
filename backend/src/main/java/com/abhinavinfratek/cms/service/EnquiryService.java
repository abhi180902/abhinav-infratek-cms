package com.abhinavinfratek.cms.service;

import com.abhinavinfratek.cms.dto.EnquiryRequest;
import com.abhinavinfratek.cms.dto.EnquiryResponse;
import com.abhinavinfratek.cms.dto.UpdateEnquiryStatusRequest;
import java.util.List;

public interface EnquiryService {

    EnquiryResponse createEnquiry(EnquiryRequest request);

    List<EnquiryResponse> getAllEnquiries();

    EnquiryResponse getEnquiryById(Long id);

    EnquiryResponse updateEnquiryStatus(Long id, UpdateEnquiryStatusRequest request);

    void deleteEnquiry(Long id);
}
