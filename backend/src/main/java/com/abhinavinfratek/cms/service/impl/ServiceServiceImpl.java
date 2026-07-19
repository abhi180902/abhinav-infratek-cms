package com.abhinavinfratek.cms.service.impl;

import com.abhinavinfratek.cms.dto.ServiceRequest;
import com.abhinavinfratek.cms.dto.ServiceResponse;
import com.abhinavinfratek.cms.entity.ServiceEntity;
import com.abhinavinfratek.cms.exception.ResourceNotFoundException;
import com.abhinavinfratek.cms.mapper.ServiceMapper;
import com.abhinavinfratek.cms.repository.ServiceRepository;
import com.abhinavinfratek.cms.service.ServiceService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ServiceServiceImpl implements ServiceService {

    private final ServiceRepository serviceRepository;
    private final ServiceMapper serviceMapper;

    @Override
    public List<ServiceResponse> getActiveServices() {
        return serviceRepository.findByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(serviceMapper::toResponse)
                .toList();
    }

    @Override
    public List<ServiceResponse> getAllServices() {
        return serviceRepository.findAll()
                .stream()
                .map(serviceMapper::toResponse)
                .toList();
    }

    @Override
    public ServiceResponse getServiceById(Long id) {
        return serviceMapper.toResponse(findServiceById(id));
    }

    @Override
    public ServiceResponse createService(ServiceRequest request) {
        ServiceEntity service = serviceMapper.toEntity(request);
        return serviceMapper.toResponse(serviceRepository.save(service));
    }

    @Override
    public ServiceResponse updateService(Long id, ServiceRequest request) {
        ServiceEntity service = findServiceById(id);
        serviceMapper.updateEntity(service, request);
        return serviceMapper.toResponse(serviceRepository.save(service));
    }

    @Override
    public void deleteService(Long id) {
        ServiceEntity service = findServiceById(id);
        serviceRepository.delete(service);
    }

    private ServiceEntity findServiceById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
    }
}
