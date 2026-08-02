package com.abhinavinfratek.cms.controller;

import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    private static final Logger LOGGER = LoggerFactory.getLogger(HealthController.class);
    private static final String SERVICE_NAME = "Abhinav Infratek CMS Backend";
    private static final String STATUS_UP = "UP";

    @GetMapping("/health")
    public ResponseEntity<HealthResponse> health() {
        LOGGER.info("Health check requested");

        return ResponseEntity.ok(new HealthResponse(
                true,
                SERVICE_NAME,
                STATUS_UP,
                Instant.now().toString()
        ));
    }

    private record HealthResponse(
            boolean success,
            String service,
            String status,
            String timestamp
    ) {
    }
}
