package com.abhinavinfratek.cms.service;

import com.abhinavinfratek.cms.dto.AdminAccountResponse;
import com.abhinavinfratek.cms.dto.ChangePasswordRequest;
import com.abhinavinfratek.cms.dto.SuccessResponse;
import com.abhinavinfratek.cms.dto.UpdateAdminAccountRequest;

public interface AdminAccountService {

    AdminAccountResponse getAccount(String email);

    AdminAccountResponse updateAccount(String email, UpdateAdminAccountRequest request);

    SuccessResponse changePassword(String email, ChangePasswordRequest request);
}
