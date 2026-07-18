package com.abhinavinfratek.cms.controller;

import com.abhinavinfratek.cms.dto.ClientReviewRequest;
import com.abhinavinfratek.cms.dto.ClientReviewResponse;
import com.abhinavinfratek.cms.service.ClientReviewService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ClientReviewController {

    private final ClientReviewService clientReviewService;

    @GetMapping("/api/client-reviews")
    public ResponseEntity<List<ClientReviewResponse>> getActiveClientReviews() {
        return ResponseEntity.ok(clientReviewService.getActiveClientReviews());
    }

    @GetMapping("/api/admin/client-reviews")
    public ResponseEntity<List<ClientReviewResponse>> getAllClientReviews() {
        return ResponseEntity.ok(clientReviewService.getAllClientReviews());
    }

    @GetMapping("/api/admin/client-reviews/{id}")
    public ResponseEntity<ClientReviewResponse> getClientReviewById(@PathVariable Long id) {
        return ResponseEntity.ok(clientReviewService.getClientReviewById(id));
    }

    @PostMapping(value = "/api/admin/client-reviews", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ClientReviewResponse> createClientReview(@Valid @ModelAttribute ClientReviewRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clientReviewService.createClientReview(request));
    }

    @PutMapping(value = "/api/admin/client-reviews/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ClientReviewResponse> updateClientReview(
            @PathVariable Long id,
            @Valid @ModelAttribute ClientReviewRequest request
    ) {
        return ResponseEntity.ok(clientReviewService.updateClientReview(id, request));
    }

    @DeleteMapping("/api/admin/client-reviews/{id}")
    public ResponseEntity<Void> deleteClientReview(@PathVariable Long id) {
        clientReviewService.deleteClientReview(id);
        return ResponseEntity.noContent().build();
    }
}
