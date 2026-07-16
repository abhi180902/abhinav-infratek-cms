package com.abhinavinfratek.cms.security;

import com.abhinavinfratek.cms.entity.AdminUser;
import com.abhinavinfratek.cms.repository.AdminUserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminUserRepository adminUserRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AdminUser adminUser = adminUserRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Admin user not found"));

        return new User(
                adminUser.getEmail(),
                adminUser.getPassword(),
                Boolean.TRUE.equals(adminUser.getActive()),
                true,
                true,
                true,
                List.of(new SimpleGrantedAuthority("ROLE_" + adminUser.getRole()))
        );
    }
}
