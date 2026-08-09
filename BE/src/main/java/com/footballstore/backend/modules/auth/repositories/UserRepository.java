package com.footballstore.backend.modules.auth.repositories;

import com.footballstore.backend.modules.auth.models.Role;
import com.footballstore.backend.modules.auth.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // Đếm số người dùng theo Vai trò
    long countByRole(Role role);

    // Tim kiem va loc danh sach nguoi dung cho Admin
    @Query(
        value = "SELECT u FROM User u WHERE " +
                "(CAST(:role AS string) IS NULL OR u.role = :roleEnum) AND " +
                "(CAST(:keyword AS string) IS NULL OR " +
                " LOWER(u.fullName) LIKE CAST(:keyword AS string) OR " +
                " LOWER(u.email) LIKE CAST(:keyword AS string) OR " +
                " LOWER(u.phone) LIKE CAST(:keyword AS string))",
        countQuery = "SELECT COUNT(u) FROM User u WHERE " +
                "(CAST(:role AS string) IS NULL OR u.role = :roleEnum) AND " +
                "(CAST(:keyword AS string) IS NULL OR " +
                " LOWER(u.fullName) LIKE CAST(:keyword AS string) OR " +
                " LOWER(u.email) LIKE CAST(:keyword AS string) OR " +
                " LOWER(u.phone) LIKE CAST(:keyword AS string))"
    )
    Page<User> searchUsers(
            @Param("role") String role,
            @Param("roleEnum") Role roleEnum,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
