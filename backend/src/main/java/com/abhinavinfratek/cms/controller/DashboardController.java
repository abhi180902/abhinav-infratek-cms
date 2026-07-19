package com.abhinavinfratek.cms.controller;

import com.abhinavinfratek.cms.dto.DashboardResponse;
import com.abhinavinfratek.cms.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboardSummary() {
        return ResponseEntity.ok(dashboardService.getDashboardSummary());
    }
}
