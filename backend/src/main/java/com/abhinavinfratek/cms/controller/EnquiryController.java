package com.abhinavinfratek.cms.controller;

import com.abhinavinfratek.cms.dto.EnquiryRequest;
import com.abhinavinfratek.cms.dto.EnquiryResponse;
import com.abhinavinfratek.cms.dto.UpdateEnquiryStatusRequest;
import com.abhinavinfratek.cms.service.EnquiryService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class EnquiryController {

    private final EnquiryService enquiryService;

    @PostMapping("/api/enquiries")
    public ResponseEntity<EnquiryResponse> createEnquiry(@Valid @RequestBody EnquiryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(enquiryService.createEnquiry(request));
    }

    @GetMapping("/api/admin/enquiries")
    public ResponseEntity<List<EnquiryResponse>> getAllEnquiries() {
        return ResponseEntity.ok(enquiryService.getAllEnquiries());
    }

    @GetMapping("/api/admin/enquiries/{id}")
    public ResponseEntity<EnquiryResponse> getEnquiryById(@PathVariable Long id) {
        return ResponseEntity.ok(enquiryService.getEnquiryById(id));
    }

    @DeleteMapping("/api/admin/enquiries/{id}")
    public ResponseEntity<Void> deleteEnquiry(@PathVariable Long id) {
        enquiryService.deleteEnquiry(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/api/admin/enquiries/{id}/status")
    public ResponseEntity<EnquiryResponse> updateEnquiryStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEnquiryStatusRequest request
    ) {
        return ResponseEntity.ok(enquiryService.updateEnquiryStatus(id, request));
    }
}
