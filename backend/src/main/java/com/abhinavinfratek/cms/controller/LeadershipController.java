package com.abhinavinfratek.cms.controller;

import com.abhinavinfratek.cms.dto.LeadershipRequest;
import com.abhinavinfratek.cms.dto.LeadershipResponse;
import com.abhinavinfratek.cms.service.LeadershipService;
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
public class LeadershipController {

    private final LeadershipService leadershipService;

    @GetMapping("/api/leadership")
    public ResponseEntity<List<LeadershipResponse>> getActiveLeadershipMembers() {
        return ResponseEntity.ok(leadershipService.getActiveLeadershipMembers());
    }

    @GetMapping("/api/admin/leadership")
    public ResponseEntity<List<LeadershipResponse>> getAllLeadershipMembers() {
        return ResponseEntity.ok(leadershipService.getAllLeadershipMembers());
    }

    @GetMapping("/api/admin/leadership/{id}")
    public ResponseEntity<LeadershipResponse> getLeadershipMemberById(@PathVariable Long id) {
        return ResponseEntity.ok(leadershipService.getLeadershipMemberById(id));
    }

    @PostMapping(value = "/api/admin/leadership", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<LeadershipResponse> createLeadershipMember(@Valid @ModelAttribute LeadershipRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leadershipService.createLeadershipMember(request));
    }

    @PutMapping(value = "/api/admin/leadership/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<LeadershipResponse> updateLeadershipMember(
            @PathVariable Long id,
            @Valid @ModelAttribute LeadershipRequest request
    ) {
        return ResponseEntity.ok(leadershipService.updateLeadershipMember(id, request));
    }

    @DeleteMapping("/api/admin/leadership/{id}")
    public ResponseEntity<Void> deleteLeadershipMember(@PathVariable Long id) {
        leadershipService.deleteLeadershipMember(id);
        return ResponseEntity.noContent().build();
    }
}
