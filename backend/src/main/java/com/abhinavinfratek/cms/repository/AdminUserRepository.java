package com.abhinavinfratek.cms.repository;

import com.abhinavinfratek.cms.entity.AdminUser;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {

    Optional<AdminUser> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByRole(String role);

    boolean existsByEmailAndIdNot(String email, Long id);
}
