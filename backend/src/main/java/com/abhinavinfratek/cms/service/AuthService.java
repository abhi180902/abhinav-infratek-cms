package com.abhinavinfratek.cms.service;

import com.abhinavinfratek.cms.dto.LoginRequest;
import com.abhinavinfratek.cms.dto.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);
}
