package com.abhinavinfratek.cms.controller;

import com.abhinavinfratek.cms.dto.ServiceResponse;
import com.abhinavinfratek.cms.service.ServiceService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class PublicServiceController {

    private final ServiceService serviceService;

    @GetMapping
    public ResponseEntity<List<ServiceResponse>> getActiveServices() {
        return ResponseEntity.ok(serviceService.getActiveServices());
    }
}
