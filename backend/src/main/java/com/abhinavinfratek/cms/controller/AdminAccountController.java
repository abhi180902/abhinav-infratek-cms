package com.abhinavinfratek.cms.controller;

import com.abhinavinfratek.cms.dto.AdminAccountResponse;
import com.abhinavinfratek.cms.dto.ChangePasswordRequest;
import com.abhinavinfratek.cms.dto.SuccessResponse;
import com.abhinavinfratek.cms.dto.UpdateAdminAccountRequest;
import com.abhinavinfratek.cms.service.AdminAccountService;
import jakarta.validation.Valid;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminAccountController {

    private final AdminAccountService adminAccountService;

    @GetMapping("/account")
    public ResponseEntity<AdminAccountResponse> getAccount(Principal principal) {
        return ResponseEntity.ok(adminAccountService.getAccount(principal.getName()));
    }

    @PutMapping("/account")
    public ResponseEntity<AdminAccountResponse> updateAccount(
            Principal principal,
            @Valid @RequestBody UpdateAdminAccountRequest request
    ) {
        return ResponseEntity.ok(adminAccountService.updateAccount(principal.getName(), request));
    }

    @PutMapping("/change-password")
    public ResponseEntity<SuccessResponse> changePassword(
            Principal principal,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        return ResponseEntity.ok(adminAccountService.changePassword(principal.getName(), request));
    }
}
