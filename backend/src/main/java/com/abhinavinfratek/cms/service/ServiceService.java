package com.abhinavinfratek.cms.service;

import com.abhinavinfratek.cms.dto.ServiceRequest;
import com.abhinavinfratek.cms.dto.ServiceResponse;
import java.util.List;

public interface ServiceService {

    List<ServiceResponse> getActiveServices();

    List<ServiceResponse> getAllServices();

    ServiceResponse getServiceById(Long id);

    ServiceResponse createService(ServiceRequest request);

    ServiceResponse updateService(Long id, ServiceRequest request);

    void deleteService(Long id);
}
