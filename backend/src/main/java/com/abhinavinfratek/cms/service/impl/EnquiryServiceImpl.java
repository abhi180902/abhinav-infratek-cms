package com.abhinavinfratek.cms.service.impl;

import com.abhinavinfratek.cms.dto.EnquiryRequest;
import com.abhinavinfratek.cms.dto.EnquiryResponse;
import com.abhinavinfratek.cms.dto.UpdateEnquiryStatusRequest;
import com.abhinavinfratek.cms.entity.Enquiry;
import com.abhinavinfratek.cms.exception.ResourceNotFoundException;
import com.abhinavinfratek.cms.mapper.EnquiryMapper;
import com.abhinavinfratek.cms.repository.EnquiryRepository;
import com.abhinavinfratek.cms.service.EnquiryService;
import com.abhinavinfratek.cms.service.MailService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EnquiryServiceImpl implements EnquiryService {

    private static final Logger LOGGER = LoggerFactory.getLogger(EnquiryServiceImpl.class);

    private final EnquiryRepository enquiryRepository;
    private final EnquiryMapper enquiryMapper;
    private final MailService mailService;

    @Override
    public EnquiryResponse createEnquiry(EnquiryRequest request) {
        Enquiry enquiry = enquiryMapper.toEntity(request);
        Enquiry savedEnquiry = enquiryRepository.save(enquiry);
        LOGGER.info("Enquiry saved successfully. id={}", savedEnquiry.getId());

        sendCompanyNotification(savedEnquiry);
        sendCustomerAcknowledgement(savedEnquiry);

        return enquiryMapper.toResponse(savedEnquiry);
    }

    @Override
    public List<EnquiryResponse> getAllEnquiries() {
        return enquiryRepository.findAll()
                .stream()
                .map(enquiryMapper::toResponse)
                .toList();
    }

    @Override
    public EnquiryResponse getEnquiryById(Long id) {
        return enquiryMapper.toResponse(findEnquiryById(id));
    }

    @Override
    public EnquiryResponse updateEnquiryStatus(Long id, UpdateEnquiryStatusRequest request) {
        Enquiry enquiry = findEnquiryById(id);
        enquiry.setStatus(request.getStatus());
        return enquiryMapper.toResponse(enquiryRepository.save(enquiry));
    }

    @Override
    public void deleteEnquiry(Long id) {
        Enquiry enquiry = findEnquiryById(id);
        enquiryRepository.delete(enquiry);
    }

    private Enquiry findEnquiryById(Long id) {
        return enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found with id: " + id));
    }

    private void sendCompanyNotification(Enquiry enquiry) {
        try {
            mailService.sendCompanyNotification(enquiry);
            LOGGER.info("Company notification email sent successfully. enquiryId={}", enquiry.getId());
        } catch (RuntimeException exception) {
            LOGGER.error("Failed to send company notification email. enquiryId={}", enquiry.getId(), exception);
        }
    }

    private void sendCustomerAcknowledgement(Enquiry enquiry) {
        try {
            mailService.sendCustomerAcknowledgement(enquiry);
            LOGGER.info("Customer acknowledgement email sent successfully. enquiryId={}", enquiry.getId());
        } catch (RuntimeException exception) {
            LOGGER.error("Failed to send customer acknowledgement email. enquiryId={}", enquiry.getId(), exception);
        }
    }
}
